/**
 * The design-system copies (contracts/, copy/, tokens/, platforms/) match SHA256SUMS,
 * file for file, so a hand edit or a hand-added file fails CI with the file name.
 * Refresh them with `pnpm sync`, never by hand. Mirrors
 * tests/design-system-copy.test.ts in meritum-extension.
 *
 * @feature ADR-33
 */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { cpSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const sumLine = /^([0-9a-f]{64}) {2}(.+)$/
const sourceLine = /^meritum-design-system [0-9a-f]{40}\n$/
const copiedDirs = ['contracts', 'copy', 'tokens', 'platforms']

/** Problems of the copies in `dir`: edited files and files missing from SHA256SUMS. */
function copyProblems(dir: string): string[] {
  const lines = readFileSync(join(dir, 'SHA256SUMS'), 'utf8').trim().split('\n')
  assert.ok(lines.length > 0)
  const listed = new Set<string>()
  const edited = lines.flatMap((line) => {
    const [, sum, file] = sumLine.exec(line) ?? []
    assert.ok(sum && file, `bad SHA256SUMS line: ${line}`)
    listed.add(file)
    const actual = createHash('sha256')
      .update(readFileSync(join(dir, file)))
      .digest('hex')
    return actual === sum ? [] : [`${file}: run pnpm sync instead of editing it`]
  })
  const extra = copiedDirs
    .flatMap((copied) => readdirSync(join(dir, copied), { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => relative(dir, join(entry.parentPath, entry.name)))
    .filter((file) => !listed.has(file))
    .map((file) => `${file}: not in SHA256SUMS, add it through pnpm sync`)
  return [...edited, ...extra.sort()]
}

test('every design-system copy matches its SHA256SUMS line', () => {
  assert.deepEqual(copyProblems(root), [])
})

test('a file added by hand to a copied folder is reported by name', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ds-copy-'))
  for (const name of ['SHA256SUMS', ...copiedDirs]) {
    cpSync(join(root, name), join(dir, name), { recursive: true })
  }
  writeFileSync(join(dir, 'platforms', 'extra.html'), '<p></p>\n')
  assert.deepEqual(copyProblems(dir), [
    'platforms/extra.html: not in SHA256SUMS, add it through pnpm sync',
  ])
})

test('SOURCE names the design-system commit of the copies', () => {
  assert.match(readFileSync(join(root, 'SOURCE'), 'utf8'), sourceLine)
})
