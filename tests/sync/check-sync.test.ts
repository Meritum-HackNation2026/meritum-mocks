/**
 * The CI check of the design-system copies (scripts/check-sync.sh) names the edited file.
 *
 * @feature F-30
 */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

const checkScript = join('scripts', 'check-sync.sh')
const editedCopyReported = /copy\/pl\.json: FAILED/
const copies = ['scripts', 'SHA256SUMS', 'SOURCE', 'contracts', 'copy', 'tokens', 'platforms']

test('check-sync passes on the synced copies', () => {
  const run = spawnSync(checkScript, { encoding: 'utf8' })
  assert.equal(run.status, 0, run.stderr)
})

test('check-sync fails and names a copy edited by hand', () => {
  const dir = mkdtempSync(join(tmpdir(), 'mocks-sync-'))
  try {
    for (const path of copies) {
      cpSync(path, join(dir, path), { recursive: true })
    }
    writeFileSync(join(dir, 'copy/pl.json'), '{}\n')
    const run = spawnSync(join(dir, checkScript), { encoding: 'utf8' })
    assert.notEqual(run.status, 0)
    assert.match(run.stdout + run.stderr, editedCopyReported)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
