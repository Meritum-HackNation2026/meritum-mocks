// Platform mocks (X, Facebook, Instagram, Reddit, TikTok) for the extension demo:
// static pages from platforms/ plus a small API on the mocks' own database schema.
// The Discord mock for the jury is rendered by src/channels and calls the Meritum API.
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { type Context, Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { getCookie, setCookie } from 'hono/cookie'
import postgres from 'postgres'
import {
  buildChecksApi,
  type ChatMessage,
  DEFAULT_CARD_URL,
  MAX_FORM_BYTES,
  receiveMessage,
  renderDiscordPage,
  USER_COOKIE,
  USER_COOKIE_MAX_AGE_S,
} from './channels/index.ts'
import { LOCAL_DB } from './constants.ts'
import { isDiscordPage, platformOf, staticPath } from './routing.ts'

const env = process.env['MERITUM_ENV'] ?? 'local'
// Role meritum_mocks_<env>; its search_path is the schema mocks_<env>.
const sql = postgres(process.env['DATABASE_URL'] ?? LOCAL_DB, { max: 5, connect_timeout: 3 })

const app = new Hono()
const checksApi = buildChecksApi(process.env)
const cardUrl = process.env['MERITUM_CARD_URL'] ?? DEFAULT_CARD_URL

const discordPage = (c: Context) => isDiscordPage(c.req.path, platformOf(c.req.header('host')))
const discordHtml = (c: Context, messages: ChatMessage[]) =>
  c.html(renderDiscordPage({ messages, theme: c.req.query('theme') === 'dark' ? 'dark' : 'light' }))

app.get('*', (c, next) => (discordPage(c) ? discordHtml(c, []) : next()))

// One message to the bot; src/channels decides first contact from the mock user cookie.
app.post('*', bodyLimit({ maxSize: MAX_FORM_BYTES }), async (c, next) => {
  if (!discordPage(c)) {
    return next()
  }
  const body = await c.req.parseBody()
  const text = typeof body['text'] === 'string' ? body['text'] : ''
  const cookie = getCookie(c, USER_COOKIE)
  const { userId, messages } = await receiveMessage(checksApi, { text, cookie }, cardUrl)
  setCookie(c, USER_COOKIE, userId, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: env !== 'local',
    path: '/',
    maxAge: USER_COOKIE_MAX_AGE_S,
  })
  return discordHtml(c, messages)
})

app.get('/api/health', async (c) => {
  const platform = platformOf(c.req.header('host'))
  try {
    await sql`select 1`
    return c.json({ status: 'ok', env, platform, database: 'ok' })
  } catch {
    return c.json({ status: 'degraded', env, platform, database: 'unavailable' }, 503)
  }
})

// Mock pages change with every deploy and are small: no edge or browser cache
// (Cloudflare otherwise keeps .js/.css for 4 h and serves stale copies).
app.use('*', async (c, next) => {
  await next()
  if (!c.req.path.startsWith('/api/')) c.header('Cache-Control', 'no-cache')
})

app.use(
  '*',
  serveStatic({
    root: './platforms',
    rewriteRequestPath: (path, c) => staticPath(path, platformOf(c.req.header('host'))),
  }),
)

const port = Number(process.env['PORT'] ?? 3000)
serve({ fetch: app.fetch, port }, () => console.warn(`meritum-mocks (${env}) on :${port}`))

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => sql.end({ timeout: 5 }).finally(() => process.exit(0)))
}
