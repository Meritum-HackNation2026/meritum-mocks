/**
 * Builds the checks port from the environment.
 *
 * @feature US-WTY-08, F-04
 */
import { HttpChecksApi } from './adapters/http.ts'
import { DEFAULT_API_URL, POLL_INTERVAL_MS, POLL_TIMEOUT_MS } from './constants.ts'
import type { ChecksApi } from './ports.ts'

const trailingSlash = /\/$/

/**
 * The checks port for the API named by MERITUM_API_URL (default: the prd API).
 *
 * @param env - Process environment.
 * @returns The checks port.
 * @feature US-WTY-08, F-04
 */
export function buildChecksApi(env: NodeJS.ProcessEnv): ChecksApi {
  return new HttpChecksApi({
    baseUrl: (env['MERITUM_API_URL'] ?? DEFAULT_API_URL).replace(trailingSlash, ''),
    intervalMs: POLL_INTERVAL_MS,
    timeoutMs: POLL_TIMEOUT_MS,
  })
}
