import assert from 'node:assert/strict'
import { test } from 'node:test'
import { sourceFiles } from '../architecture/source.ts'

test('the JSDoc and constants checks cover .tsx files in tests/', () => {
  assert.ok(sourceFiles().some((f) => f.startsWith('tests/') && f.endsWith('.tsx')))
})
