import assert from 'node:assert/strict'
import { test } from 'node:test'
import { jsdocProblems, read, sourceFiles } from './source.ts'

test('every export has JSDoc with @feature, @param, @returns and @throws', () => {
  const problems = sourceFiles().flatMap((file) =>
    jsdocProblems(read(file)).map((p) => `${file}:${p}`),
  )
  assert.deepEqual(problems, [])
})

test('the JSDoc check accepts a documented function', () => {
  const text = [
    '/**',
    ' * Adds.',
    ' *',
    ' * @param a - First.',
    ' * @returns The sum.',
    ' * @throws {RangeError} When negative.',
    ' * @feature US-SPR-01, ADR-03',
    ' */',
    'export function add(a: number): number {',
    "  if (a < 0) throw new RangeError('negative')",
    '  return a',
    '}',
  ].join('\n')
  assert.deepEqual(jsdocProblems(text), [])
})

test('the JSDoc check reports what is missing', () => {
  assert.deepEqual(jsdocProblems('export const x = 1'), ['1: export without JSDoc'])
  assert.deepEqual(jsdocProblems('/** X. */\nexport type X = string'), ['2: JSDoc needs @feature'])
  const bad = '/** X.\n * @feature US-1 */\nexport function f(a: string) {\n  return a\n}'
  assert.deepEqual(jsdocProblems(bad), [
    '3: bad @feature US-1 (US-XXX-00, F-00, ADR-00, none (infrastructure))',
    '3: JSDoc needs @param',
    '3: JSDoc needs @returns',
  ])
})
