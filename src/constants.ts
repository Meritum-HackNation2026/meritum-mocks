/**
 * Constants of the platform mocks.
 *
 * @feature US-WTY-01, ADR-10
 */

/**
 * Platforms with a mock.
 *
 * @feature US-WTY-01, ADR-10
 */
export const PLATFORMS = ['x', 'facebook', 'instagram', 'reddit', 'tiktok'] as const

/**
 * Host of a platform mock on prd or dev (any port); the group is the platform.
 *
 * @feature US-WTY-01, ADR-10
 */
export const PLATFORM_HOST =
  /^meritum-(x|facebook|instagram|reddit|tiktok)(?:-dev)?\.gburek\.app(?::\d+)?$/

/**
 * Database of `docker compose up -d db` in meritum-backend, used when DATABASE_URL is unset.
 *
 * @feature none (infrastructure)
 */
// biome-ignore lint/security/noSecrets: local development database, the same as in the backend README
export const LOCAL_DB = 'postgresql://meritum:meritum@localhost:5432/meritum'
