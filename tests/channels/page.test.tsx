import assert from 'node:assert/strict'
import { test } from 'node:test'
import { render, screen, within } from '@testing-library/react'
import copy from '../../copy/pl.json' with { type: 'json' }
import { DiscordPage, renderDiscordPage } from '../../src/channels/index.ts'

test('the conversation shows the user message and each bot message, announced live', () => {
  render(
    <DiscordPage
      messages={[
        { author: 'user', text: 'Czy polski jest językiem urzędowym?' },
        { author: 'bot', text: 'Potwierdzone: tak.\nSiła podstawy: Mocna' },
      ]}
    />,
  )
  const log = screen.getByRole('log')
  const items = within(log).getAllByRole('listitem')
  assert.equal(items.length, 2)
  assert.ok(within(items[0] as HTMLElement).getByText(copy.form.input_label))
  assert.ok(within(items[1] as HTMLElement).getByText(copy.brand.name))
  assert.ok(within(items[1] as HTMLElement).getByText('Siła podstawy: Mocna', { exact: false }))
})

test('the message box is labelled and sends with the submit button', () => {
  render(<DiscordPage messages={[]} />)
  const box = screen.getByRole('textbox', { name: copy.form.input_label })
  assert.equal(box.getAttribute('maxlength'), '4000')
  assert.ok(screen.getByRole('button', { name: copy.form.submit }))
})

test('the rendered document carries the Discord skin and the theme', () => {
  const html = renderDiscordPage({ messages: [], theme: 'dark' })
  assert.ok(html.startsWith('<!DOCTYPE html><html lang="pl" data-theme="dark" data-host="discord"'))
})

test('the reply is the focus target after sending, and links in it are clickable', () => {
  render(
    <DiscordPage
      messages={[
        { author: 'user', text: 'Pytanie' },
        { author: 'bot', text: 'Pełna karta: https://meritum.example/c_01.\nkoniec' },
        { author: 'bot', text: 'Druga' },
      ]}
    />,
  )
  assert.equal(document.querySelector('form')?.getAttribute('action'), '#reply')
  const reply = document.getElementById('reply')
  assert.equal(reply?.getAttribute('tabindex'), '-1')
  assert.ok(reply?.textContent?.includes('Pełna karta'))
  const link = screen.getByRole('link', { name: 'https://meritum.example/c_01' })
  assert.equal(link.getAttribute('href'), 'https://meritum.example/c_01')
})

test('the header shows the 14 px Meritum mark before the name', () => {
  const html = renderDiscordPage({ messages: [], theme: 'light' })
  const header = html.slice(html.indexOf('<header>'), html.indexOf('</header>'))
  assert.ok(header.includes('width="14"'))
  assert.ok(header.includes(`<h1>${copy.brand.name}</h1>`))
})
