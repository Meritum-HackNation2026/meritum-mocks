/**
 * Lexical helpers for the architecture tests: list the repo's files and read the
 * exported declarations of Biome-formatted TypeScript with their JSDoc.
 *
 * shortcut: a line-based reader, not a parser. It relies on Biome formatting
 * (top-level declarations start in column 0, bodies end with `}` in column 0).
 * TypeScript 7 ships no stable compiler API yet; switch to it when it does.
 *
 * @feature none (infrastructure)
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { settings } from './settings.ts'

/** Feature IDs from the product document, or the marker for plumbing. */
const featureId = /^(US-[A-Z]{3}-\d{2}|F-\d{2}|ADR-\d{2})$/
const noFeature = 'none (infrastructure)'
const codeFile = /\.(ts|tsx|js|mjs|cjs|css)$/
const exportLine = /^export (?!\{|\*|type \{)/
const functionLike = /^(?!export (type|interface) ).*(\bfunction\b|=\s*(async\s*)?(<[^>]*>)?\()/
const typeScriptFile = /\.tsx?$/
const closingLine = /^[}\])]/
const featureTag = /@feature[ \t]+(.+?)[ \t]*(\*\/)?$/m
const separators = /[,\s]+/
const firstParams = /\(([^)]*)\)/
const voidReturn = /\)\s*:\s*(void|Promise<void>)\s*(\{|=>)/
const functionDeclaration = /^export (default )?(async )?function/
const throwStatement = /\bthrow\b/

/** One top-level `export` declaration with the JSDoc right above it. */
type Declaration = { line: number; text: string; jsdoc: string | null; body: string }

/**
 * Every file of the repo (tracked or new, .gitignore respected) that is not excluded.
 *
 * @returns Paths relative to the repository root.
 * @feature none (infrastructure)
 */
function repoFiles(): string[] {
  const out = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'])
  const files = out.toString().split('\n').filter(Boolean)
  return files.filter((f) => !settings.excluded.some((prefix) => f.startsWith(prefix)))
}

/**
 * Code files under the line limit.
 *
 * @returns Paths relative to the repository root.
 * @feature none (infrastructure)
 */
export function codeFiles(): string[] {
  return repoFiles().filter((f) => codeFile.test(f))
}

/**
 * Application TypeScript files the JSDoc and constants rules cover (tests excluded).
 *
 * @returns Paths relative to the repository root.
 * @feature none (infrastructure)
 */
export function sourceFiles(): string[] {
  const inSource = (f: string) => settings.sourceDirs.some((dir) => f.startsWith(dir))
  return repoFiles().filter((f) => inSource(f) && typeScriptFile.test(f) && !f.includes('.test.'))
}

/**
 * Read a file as text.
 *
 * @param path - Path relative to the repository root.
 * @returns The file content.
 * @feature none (infrastructure)
 */
export function read(path: string): string {
  return readFileSync(path, 'utf8')
}

/**
 * The JSDoc block that ends right above a line; `// biome-ignore` lines may sit between.
 *
 * @param lines - The file's lines.
 * @param index - Index of the documented line.
 * @returns The block, or null when there is none.
 * @feature none (infrastructure)
 */
export function jsdocAbove(lines: string[], index: number): string | null {
  let end = index
  while (lines[end - 1]?.trimStart().startsWith('// biome-ignore')) {
    end -= 1
  }
  if (!lines[end - 1]?.trimEnd().endsWith('*/')) {
    return null
  }
  const start = lines.slice(0, end).findLastIndex((l) => l.trimStart().startsWith('/**'))
  return start === -1 ? null : lines.slice(start, end).join('\n')
}

function bodyOf(lines: string[], index: number): string {
  const end = lines.findIndex((l, i) => i > index && closingLine.test(l))
  return lines.slice(index, end === -1 ? undefined : end + 1).join('\n')
}

/**
 * Top-level exported declarations of a source text.
 *
 * @param text - Biome-formatted TypeScript.
 * @returns The declarations in source order.
 * @feature none (infrastructure)
 */
function declarations(text: string): Declaration[] {
  const lines = text.split('\n')
  return lines.flatMap((text, index) =>
    exportLine.test(text)
      ? [{ line: index + 1, text, jsdoc: jsdocAbove(lines, index), body: bodyOf(lines, index) }]
      : [],
  )
}

function featureProblem(jsdoc: string): string | null {
  const value = featureTag.exec(jsdoc)?.[1]
  if (value === undefined) {
    return 'JSDoc needs @feature'
  }
  const ids = value.split(separators).filter(Boolean)
  const valid = value === noFeature || ids.every((id) => featureId.test(id))
  return valid ? null : `bad @feature ${value} (US-XXX-00, F-00, ADR-00, ${noFeature})`
}

function signatureProblems(declaration: Declaration, jsdoc: string): string[] {
  const { text, body } = declaration
  const params = firstParams.exec(body)?.[1]?.trim() ?? ''
  const returnsVoid = voidReturn.test(body)
  const problems: string[] = []
  if (params !== '' && !jsdoc.includes('@param')) {
    problems.push('JSDoc needs @param')
  }
  if (!(returnsVoid || jsdoc.includes('@returns'))) {
    problems.push('JSDoc needs @returns')
  }
  const throws = functionDeclaration.test(text) && throwStatement.test(body)
  if (throws && !jsdoc.includes('@throws')) {
    problems.push('JSDoc needs @throws')
  }
  return problems
}

/**
 * JSDoc problems of one file: every export has JSDoc with a valid @feature, and
 * functions document their parameters, return value and thrown errors.
 *
 * @param text - Biome-formatted TypeScript.
 * @returns `line: message` strings.
 * @feature none (infrastructure)
 */
export function jsdocProblems(text: string): string[] {
  return declarations(text).flatMap((declaration) => {
    const { jsdoc, line } = declaration
    if (jsdoc === null) {
      return [`${line}: export without JSDoc`]
    }
    const problems = [featureProblem(jsdoc)].filter((p) => p !== null)
    if (functionLike.test(declaration.text)) {
      problems.push(...signatureProblems(declaration, jsdoc))
    }
    return problems.map((p) => `${line}: ${p}`)
  })
}
