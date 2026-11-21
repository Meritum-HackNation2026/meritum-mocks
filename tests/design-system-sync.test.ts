/**
 * scripts/sync.sh keeps file names with spaces whole: it asks `gh` for the
 * URL-encoded path, copies platforms/ from the tarball and writes correct
 * SHA256SUMS lines. A fake `gh` on PATH stands in for GitHub, so the test runs
 * offline. Mirrors tests/design-system-sync.test.ts in meritum-extension.
 *
 * @feature ADR-33
 */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

const filesArray = /files=\([^)]*\)/
const fakeGh = (tarDir: string) => `#!/usr/bin/env bash
for arg; do [[ $arg == repos/* ]] && endpoint=$arg; done
case $endpoint in
  *' '*) echo "unencoded space in $endpoint" >&2; exit 1 ;;
  */commits/*) echo ${'a'.repeat(40)} ;;
  */tarball/*) tar -cz -C '${tarDir}' ds ;;
  *) printf 'content of %s' "\${endpoint%%\\?*}" ;;
esac
`
const sha = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex')

test('sync copies files with a space in the name and sums them', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ds-sync-'))
  const page = join(dir, 'tar', 'ds', 'demo', 'platforms', 'a b', 'my page.html')
  mkdirSync(join(page, '..'), { recursive: true })
  writeFileSync(page, '<p></p>\n')
  mkdirSync(join(dir, 'scripts'))
  mkdirSync(join(dir, 'bin'))
  writeFileSync(join(dir, 'bin', 'gh'), fakeGh(join(dir, 'tar')))
  chmodSync(join(dir, 'bin', 'gh'), 0o755)
  const script = readFileSync(new URL('../scripts/sync.sh', import.meta.url), 'utf8').replace(
    filesArray,
    "files=('docs/a b.css')",
  )
  writeFileSync(join(dir, 'scripts', 'sync.sh'), script)
  execFileSync('bash', [join(dir, 'scripts', 'sync.sh')], {
    env: { ...process.env, PATH: `${join(dir, 'bin')}:${process.env['PATH']}` },
    stdio: 'pipe',
  })
  assert.equal(
    readFileSync(join(dir, 'SHA256SUMS'), 'utf8'),
    `${sha(join(dir, 'docs', 'a b.css'))}  docs/a b.css\n` +
      `${sha(join(dir, 'platforms', 'a b', 'my page.html'))}  platforms/a b/my page.html\n`,
  )
})
