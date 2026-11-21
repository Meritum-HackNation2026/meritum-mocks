import assert from 'node:assert/strict'
import { test } from 'node:test'
import { jsdocAbove, read, sourceFiles } from './source.ts'

const constantLine = /^(export )?const [A-Z][A-Z0-9_]*\b/
const constantsFile = /(^|\/)constants\.ts$/

test('UPPER_CASE constants live in constants.ts, each with JSDoc', () => {
  const problems = sourceFiles().flatMap((file) => {
    const lines = read(file).split('\n')
    const inConstants = constantsFile.test(file)
    return lines.flatMap((line, i) => {
      if (!constantLine.test(line)) {
        return []
      }
      if (!inConstants) {
        return [`${file}:${i + 1}: move the constant to constants.ts`]
      }
      return jsdocAbove(lines, i) !== null
        ? []
        : [`${file}:${i + 1}: document the constant with JSDoc`]
    })
  })
  assert.deepEqual(problems, [])
})
