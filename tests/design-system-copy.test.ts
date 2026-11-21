/**
 * The design-system copies (contracts/, copy/, tokens/, platforms/) match SHA256SUMS,
 * so a hand edit or a hand-added file fails CI with the file name. Refresh them with
 * `pnpm sync`, never by hand. Mirrors tests/design-system-copy.test.ts in meritum-extension.
 *
 * @feature ADR-33
 */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  chmodSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const sumLine = /^([0-9a-f]{64}) {2}(.+)$/
const sourceLine = /^meritum-design-system [0-9a-f]{40}\n$/

/** Files that differ from SHA256SUMS or sit in a copied folder without a line in it. */
function copyProblems(root: string): string[] {
  const lines = readFileSync(join(root, 'SHA256SUMS'), 'utf8').trim().split('\n')
  const listed = new Set<string>()
  const mismatched = lines.flatMap((line) => {
    const [, sum, file] = sumLine.exec(line) ?? []
    assert.ok(sum && file, `bad SHA256SUMS line: ${line}`)
    listed.add(file)
    const actual = createHash('sha256')
      .update(readFileSync(join(root, file)))
      .digest('hex')
    return actual === sum ? [] : [`${file}: run pnpm sync instead of editing it`]
  })
  const dirs = new Set([...listed].map((file) => file.split('/')[0] ?? file))
  const extra = [...dirs].flatMap((dir) =>
    readdirSync(join(root, dir), { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) =>
        join(entry.parentPath, entry.name)
          .slice(root.length + 1)
          .replaceAll('\\', '/'),
      )
      .filter((file) => !listed.has(file))
      .map((file) => `${file}: not in SHA256SUMS, add it to the design system and run pnpm sync`),
  )
  return [...mismatched, ...extra]
}

test('every design-system copy matches its SHA256SUMS line', () => {
  assert.deepEqual(copyProblems(repoRoot), [])
})

test('a file added by hand to a copied folder is reported by name', () => {
  const root = mkdtempSync(join(tmpdir(), 'ds-copy-'))
  for (const name of ['SHA256SUMS', 'contracts', 'copy', 'tokens', 'platforms']) {
    cpSync(join(repoRoot, name), join(root, name), { recursive: true })
  }
  writeFileSync(join(root, 'platforms', 'extra.html'), '<p>hand made</p>')
  assert.deepEqual(copyProblems(root), [
    'platforms/extra.html: not in SHA256SUMS, add it to the design system and run pnpm sync',
  ])
})

test('pnpm sync copies a file with a space in its name and sums it', () => {
  const work = mkdtempSync(join(tmpdir(), 'ds-sync-'))
  const source = join(work, 'source', 'ds')
  mkdirSync(join(source, 'demo', 'platforms', 'a b'), { recursive: true })
  writeFileSync(join(source, 'demo', 'platforms', 'a b', 'my page.html'), 'spaced')
  for (const file of ['contracts/meritum.ts', 'copy/pl.json', 'tokens/meritum.css']) {
    mkdirSync(join(source, file, '..'), { recursive: true })
    writeFileSync(join(source, file), file)
  }
  const repo = join(work, 'repo')
  mkdirSync(join(repo, 'scripts'), { recursive: true })
  cpSync(join(repoRoot, 'scripts', 'sync.sh'), join(repo, 'scripts', 'sync.sh'))
  // Fake gh: answers the three `gh api` calls of sync.sh from the source folder.
  const bin = join(work, 'bin')
  mkdirSync(bin)
  writeFileSync(
    join(bin, 'gh'),
    `#!/usr/bin/env bash
case "$*" in
  *commits/*) echo ${'a'.repeat(40)} ;;
  *tarball/*) tar -cz -C "${join(work, 'source')}" ds ;;
  *contents/*) a="$*"; p="\${a##*contents/}"; cat "${source}/\${p%%\\?ref=*}" ;;
esac
`,
  )
  chmodSync(join(bin, 'gh'), 0o755)
  execFileSync(join(repo, 'scripts', 'sync.sh'), {
    env: { ...process.env, PATH: `${bin}:${process.env['PATH']}` },
  })
  assert.equal(readFileSync(join(repo, 'platforms', 'a b', 'my page.html'), 'utf8'), 'spaced')
  assert.deepEqual(copyProblems(repo), [])
  assert.ok(
    readFileSync(join(repo, 'SHA256SUMS'), 'utf8').includes('  platforms/a b/my page.html\n'),
  )
})

test('SOURCE names the design-system commit of the copies', () => {
  assert.match(readFileSync(join(repoRoot, 'SOURCE'), 'utf8'), sourceLine)
})
