import assert from 'node:assert/strict'
import { test } from 'node:test'
import copy from '../../copy/pl.json' with { type: 'json' }
import { DISCORD_MESSAGE_LIMIT, discordReply } from '../../src/channels/index.ts'
import { decisiveClaim, doneResult } from './fixtures.ts'

const card = 'https://meritum.example/c_01'

test('summary with every verdict and the card link, then one message per claim', () => {
  const unsettled = decisiveClaim({
    claim: 'Wrocław jako jedyny miał darmowe przejazdy dla 65-latków.',
    verdict: 'insufficient_evidence',
    strength: null,
    citations: [],
    unresolved: 'Nie znaleźliśmy listy miast z takim uprawnieniem.',
  })
  const [summary, first, second, ...rest] = discordReply(doneResult([decisiveClaim(), unsettled]), {
    cardUrl: card,
    firstContact: false,
  })
  assert.equal(
    summary,
    'Wynik sprawdzenia (2 twierdzeń). Pełna karta: https://meritum.example/c_01\n' +
      'Potwierdzone: Językiem urzędowym w Polsce jest język polski.\n' +
      'Brak wystarczających dowodów: Wrocław jako jedyny miał darmowe przejazdy dla 65-latków.',
  )
  assert.equal(
    first,
    'Potwierdzone: Językiem urzędowym w Polsce jest język polski.\n' +
      '„W Rzeczypospolitej Polskiej językiem urzędowym jest język polski.” (Sejm RP, 16 lipca 1997)\n' +
      'Siła podstawy: Mocna',
  )
  assert.equal(
    second,
    'Brak wystarczających dowodów: Wrocław jako jedyny miał darmowe przejazdy dla 65-latków.\n' +
      'Nie znaleźliśmy listy miast z takim uprawnieniem.',
  )
  assert.deepEqual(rest, [])
})

test('the first reply to a new user says an AI system answers', () => {
  const [first] = discordReply(doneResult([decisiveClaim()]), { cardUrl: card, firstContact: true })
  assert.ok(first?.startsWith(`${copy.ai_notice.discord}\n`))
  const [later] = discordReply(doneResult([decisiveClaim()]), {
    cardUrl: card,
    firstContact: false,
  })
  assert.ok(!later?.includes(copy.ai_notice.discord))
})

test('a quote without a publication date says so, a claim without strength skips that line', () => {
  const claim = decisiveClaim({ verdict: 'misleading', strength: null })
  const citation = claim.citations?.[0]
  assert.ok(citation)
  citation.source.published_at = null
  const [, message] = discordReply(doneResult([claim]), { cardUrl: card, firstContact: false })
  assert.ok(message?.endsWith('(Sejm RP, data publikacji nieznana)'))
})

test('a check without claims answers with the status and its hint from copy', () => {
  const messages = discordReply(
    { check_id: 'c_02', status: 'needs_clarification', message: 'API text', corpus_version: 'v1' },
    { cardUrl: card, firstContact: false },
  )
  assert.deepEqual(messages, [
    `${copy.status.needs_clarification}\n${copy.status_hint.needs_clarification}`,
  ])
})

test('no message is longer than 2000 characters and no quote is cut', () => {
  const fragment = `${'Długi cytat ze źródła. '.repeat(80)}koniec.`
  const claims = Array.from({ length: 5 }, (_, i) =>
    decisiveClaim({ claim: `${i} ${'Twierdzenie o faktach. '.repeat(21)}` }),
  )
  const long = claims[0]?.citations?.[0]
  assert.ok(long)
  long.fragment = fragment
  const messages = discordReply(doneResult(claims), { cardUrl: card, firstContact: true })
  assert.ok(messages.every((m) => m.length <= DISCORD_MESSAGE_LIMIT))
  assert.ok(messages.length > 1 + claims.length, 'the long summary and claim were split')
  assert.ok(messages.some((m) => m.includes(`„${fragment}”`)))
  for (const claim of claims) {
    assert.ok(messages.some((m) => m.includes(claim.claim)))
  }
})

test('a quote with a line break stays whole when it does not fit after the claim', () => {
  const claim = decisiveClaim({ claim: `${'Twierdzenie o faktach. '.repeat(26)}koniec.` })
  const citation = claim.citations?.[0]
  assert.ok(citation)
  citation.fragment = `${'Pierwsza linia cytatu. '.repeat(40)}\n${'Druga linia cytatu. '.repeat(40)}`
  const [, ...messages] = discordReply(doneResult([claim]), { cardUrl: card, firstContact: false })
  assert.ok(messages.every((m) => m.length <= DISCORD_MESSAGE_LIMIT))
  assert.ok(messages.some((m) => m.includes(`„${citation.fragment}”`)))
})
