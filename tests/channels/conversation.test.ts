import assert from 'node:assert/strict'
import { test } from 'node:test'
import copy from '../../copy/pl.json' with { type: 'json' }
import {
  answerMessage,
  type ChecksApi,
  type DiscordCheckRequest,
} from '../../src/channels/index.ts'
import { decisiveClaim, doneResult } from './fixtures.ts'

/** API stand-in that records requests and answers with one finished check. */
function fakeApi(fail = false): ChecksApi & { requests: DiscordCheckRequest[] } {
  const requests: DiscordCheckRequest[] = []
  return {
    requests,
    check: (request) => {
      requests.push(request)
      return fail
        ? Promise.reject(new Error('down'))
        : Promise.resolve(doneResult([decisiveClaim()]))
    },
  }
}

const card = 'https://meritum.example/c/{check_id}'

test('the message goes to the API as a discord check with the mock user id', async () => {
  const api = fakeApi()
  const messages = await answerMessage(
    api,
    { text: '  Czy polski jest językiem urzędowym?  ', userId: 'u-1', firstContact: false },
    card,
  )
  assert.deepEqual(api.requests, [
    { channel: 'discord', text: 'Czy polski jest językiem urzędowym?', channel_user_id: 'u-1' },
  ])
  assert.ok(messages[0]?.includes('Pełna karta: https://meritum.example/c/c_01\n'))
})

test('empty or too long text is not sent', async () => {
  const api = fakeApi()
  const empty = await answerMessage(api, { text: ' a ', userId: 'u', firstContact: false }, card)
  const long = await answerMessage(
    api,
    { text: 'x'.repeat(4001), userId: 'u', firstContact: false },
    card,
  )
  assert.deepEqual([empty, long, api.requests], [[copy.errors.empty], [copy.errors.too_long], []])
})

test('a first message that is not sent still opens with the AI notice', async () => {
  const messages = await answerMessage(
    fakeApi(),
    { text: '   ', userId: 'u', firstContact: true },
    card,
  )
  assert.deepEqual(messages, [`${copy.ai_notice.discord}\n${copy.errors.empty}`])
})

test('an API failure is a technical problem, not a verdict, with the AI notice first', async () => {
  const messages = await answerMessage(
    fakeApi(true),
    { text: 'Czy polski jest językiem urzędowym?', userId: 'u', firstContact: true },
    card,
  )
  assert.deepEqual(messages, [
    `${copy.ai_notice.discord}\n${copy.status.technical_failure}\n${copy.status_hint.technical_failure}`,
  ])
})
