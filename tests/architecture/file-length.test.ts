import assert from 'node:assert/strict'
import { test } from 'node:test'
import { settings } from './settings.ts'
import { codeFiles, read } from './source.ts'

test(`code files have at most ${settings.maxLines} lines`, () => {
  const tooLong = codeFiles()
    .map((file) => `${file}: ${read(file).trimEnd().split('\n').length} lines`)
    .filter((entry) => Number(entry.split(': ')[1]?.split(' ')[0]) > settings.maxLines)
  assert.deepEqual(tooLong, [])
})
