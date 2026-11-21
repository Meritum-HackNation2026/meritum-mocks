import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PLATFORMS, platformOf, staticPath } from './routing.ts'

test('platform hosts of prd and dev', () => {
  for (const p of PLATFORMS) {
    assert.equal(platformOf(`meritum-${p}.gburek.app`), p)
    assert.equal(platformOf(`meritum-${p}-dev.gburek.app`), p)
  }
})

test('other hosts are not platforms', () => {
  for (const host of [
    'meritum.gburek.app',
    'meritum-dev.gburek.app',
    'localhost:3000',
    'meritum-x.gburek.app.evil.com',
    undefined,
  ]) {
    assert.equal(platformOf(host), null)
  }
})

test('platform host maps the root and its files, keeps shared assets', () => {
  assert.equal(staticPath('/', 'reddit'), '/reddit/index.html')
  assert.equal(staticPath('/index.html', 'reddit'), '/reddit/index.html')
  assert.equal(staticPath('/assets/mock.css', 'reddit'), '/assets/mock.css')
  assert.equal(staticPath('/reddit/', null), '/reddit/')
})
