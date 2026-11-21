/**
 * The design-system copies (contracts/, copy/, tokens/, platforms/) match SHA256SUMS,
 * so a hand edit fails CI with the file name. Refresh them with `pnpm sync`, never by
 * hand. Mirrors tests/design-system-copy.test.ts in meritum-extension.
 *
 * @feature ADR-33
 */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)
const sumLine = /^([0-9a-f]{64}) {2}(.+)$/
const sourceLine = /^meritum-design-system [0-9a-f]{40}\n$/

test('every design-system copy matches its SHA256SUMS line', () => {
  const lines = readFileSync(new URL('SHA256SUMS', root), 'utf8').trim().split('\n')
  const mismatched = lines.flatMap((line) => {
    const [, sum, file] = sumLine.exec(line) ?? []
    assert.ok(sum && file, `bad SHA256SUMS line: ${line}`)
    const actual = createHash('sha256')
      .update(readFileSync(new URL(file, root)))
      .digest('hex')
    return actual === sum ? [] : [`${file}: run pnpm sync instead of editing it`]
  })
  assert.ok(lines.length > 0)
  assert.deepEqual(mismatched, [])
})

test('SOURCE names the design-system commit of the copies', () => {
  assert.match(readFileSync(new URL('SOURCE', root), 'utf8'), sourceLine)
})
