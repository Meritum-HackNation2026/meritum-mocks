import assert from 'node:assert/strict'
import { test } from 'node:test'
import { sourceFiles } from './source.ts'

test('the JSDoc and constants checks cover .tsx files in tests/', () => {
  assert.ok(sourceFiles().includes('tests/example/brand-heading.tsx'))
})
