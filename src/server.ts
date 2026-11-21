// Platform mocks (X, Facebook, Instagram, Reddit, TikTok) for the extension demo:
// static pages from platforms/ plus a small API on the mocks' own database schema.
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import postgres from 'postgres'
import { platformOf, staticPath } from './routing.ts'

const env = process.env.MERITUM_ENV ?? 'local'
// Role meritum_mocks_<env>; its search_path is the schema mocks_<env>.
const sql = postgres(
  process.env.DATABASE_URL ?? 'postgresql://meritum:meritum@localhost:5432/meritum',
  {
    max: 5,
    connect_timeout: 3,
  },
)

const app = new Hono()

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

const port = Number(process.env.PORT ?? 3000)
serve({ fetch: app.fetch, port }, () => console.warn(`meritum-mocks (${env}) on :${port}`))

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => sql.end({ timeout: 5 }).finally(() => process.exit(0)))
}
