import assert from 'node:assert/strict'
import { test } from 'node:test'
import { render, screen } from '@testing-library/react'
import copy from '../../copy/pl.json' with { type: 'json' }
import { BrandHeading } from './brand-heading.tsx'

const brandName = copy.brand.name

test('the heading shows the brand name', () => {
  render(<BrandHeading text={brandName} />)
  assert.ok(screen.getByRole('heading', { level: 1, name: brandName }))
})

test('tests/setup-dom.ts clears the DOM after each test', () => {
  assert.equal(screen.queryByRole('heading'), null)
})
