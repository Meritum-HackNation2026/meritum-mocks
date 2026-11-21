import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HttpChecksApi } from '../../src/channels/adapters/http.ts'
import { decisiveClaim, doneResult } from './fixtures.ts'

const request = {
  channel: 'discord',
  text: 'Czy polski jest urzędowy?',
  channel_user_id: 'u',
} as const

/** fetch stand-in answering from a queue and recording the calls. */
function fakeFetch(answers: unknown[], calls: string[]): typeof fetch {
  return (input, init) => {
    calls.push(`${init?.method ?? 'GET'} ${String(input)}`)
    return Promise.resolve(Response.json(answers.shift()))
  }
}

test('posts the check, then polls its status until the result is there', async () => {
  const calls: string[] = []
  const result = doneResult([decisiveClaim()])
  const api = new HttpChecksApi({
    baseUrl: 'https://api.example',
    intervalMs: 0,
    timeoutMs: 1000,
    fetch: fakeFetch([{ check_id: 'c 1' }, { check_id: 'c 1', steps: [] }, { result }], calls),
  })
  assert.deepEqual(await api.check(request), result)
  assert.deepEqual(calls, [
    'POST https://api.example/api/v1/checks',
    'GET https://api.example/api/v1/checks/c%201',
    'GET https://api.example/api/v1/checks/c%201',
  ])
})

test('an error status or a missing check id is a failure', async () => {
  const failing = (answer: Response) =>
    new HttpChecksApi({
      baseUrl: '',
      intervalMs: 0,
      timeoutMs: 0,
      fetch: () => Promise.resolve(answer),
    }).check(request)
  await assert.rejects(failing(new Response(null, { status: 503 })))
  await assert.rejects(failing(Response.json({})))
})

test('a result the channel cannot read is a failure', async () => {
  const unknownVerdict = doneResult([decisiveClaim({ verdict: 'maybe' as 'false' })])
  const results = [{ status: 'done' }, unknownVerdict, { ...unknownVerdict, status: 'odd' }]
  const apis = results.map(
    (result) =>
      new HttpChecksApi({
        baseUrl: '',
        intervalMs: 0,
        timeoutMs: 1000,
        fetch: fakeFetch([{ check_id: 'c' }, { check_id: 'c', steps: [], result }], []),
      }),
  )
  await Promise.all(apis.map((api) => assert.rejects(api.check(request))))
  const nothing = new HttpChecksApi({
    baseUrl: '',
    intervalMs: 0,
    timeoutMs: 0,
    fetch: () => Promise.resolve(Response.json(null)),
  })
  await assert.rejects(nothing.check(request))
})
