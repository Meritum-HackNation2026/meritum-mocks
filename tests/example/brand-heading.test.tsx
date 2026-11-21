import assert from 'node:assert/strict'
import { test } from 'node:test'
import { render, screen } from '@testing-library/react'
import { BrandHeading } from './brand-heading.tsx'

// brand.name in copy/pl.json; read it from the copy once it is synced (meritum-mocks#11).
const brandName = 'Meritum'

test('the heading shows the brand name', () => {
  render(<BrandHeading text={brandName} />)
  assert.ok(screen.getByRole('heading', { level: 1, name: brandName }))
})

test('tests/setup-dom.ts clears the DOM after each test', () => {
  assert.equal(screen.queryByRole('heading'), null)
})
