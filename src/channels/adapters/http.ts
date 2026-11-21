/**
 * HTTP adapter of the checks port: POST /api/v1/checks, then GET /api/v1/checks/{id}
 * until AnalysisStatus has a result.
 *
 * @feature US-WTY-08, F-04
 */
import { setTimeout as sleep } from 'node:timers/promises'
import type { AnalysisStatus, CheckResult } from '../../../contracts/meritum.ts'
import type { ChecksApi, DiscordCheckRequest } from '../ports.ts'

// Trust boundary: the channel reads these fields of the result; the API owns the rest.
function checked(result: CheckResult): CheckResult {
  const isResult =
    typeof result.check_id === 'string' &&
    typeof result.status === 'string' &&
    (result.claims === undefined || Array.isArray(result.claims))
  if (!isResult) {
    throw new Error('GET /api/v1/checks/{id} answered with a malformed result')
  }
  return result
}

/**
 * Where the API is and how long to wait for a result.
 *
 * @feature US-WTY-08, F-04
 */
export interface HttpChecksApiOptions {
  /** API origin, without a trailing slash. */
  baseUrl: string
  /** Pause between polls. */
  intervalMs: number
  /** Longest wait for the result. */
  timeoutMs: number
  /** fetch to use; tests pass a stand-in. */
  fetch?: typeof fetch
}

/**
 * The checks port over the Meritum HTTP API.
 *
 * @feature US-WTY-08, F-04
 */
export class HttpChecksApi implements ChecksApi {
  readonly #options: HttpChecksApiOptions
  readonly #fetch: typeof fetch

  /**
   * @param options - Where the API is and how long to wait.
   */
  constructor(options: HttpChecksApiOptions) {
    this.#options = options
    this.#fetch = options.fetch ?? fetch
  }

  /**
   * Send the request and poll until the result is there.
   *
   * @param request - The Discord check.
   * @returns The CheckResult.
   * @throws {Error} When the API answers with an error, without a check id, or too late.
   */
  async check(request: DiscordCheckRequest): Promise<CheckResult> {
    const started = await this.#json('/api/v1/checks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(request),
    })
    const checkId = (started as { check_id?: unknown }).check_id
    if (typeof checkId !== 'string') {
      throw new Error('POST /api/v1/checks answered without check_id')
    }
    const deadline = Date.now() + this.#options.timeoutMs
    while (Date.now() < deadline) {
      // biome-ignore lint/performance/noAwaitInLoops: polling is sequential by design
      const status = (await this.#json(
        `/api/v1/checks/${encodeURIComponent(checkId)}`,
      )) as AnalysisStatus
      if (status.result) {
        return checked(status.result)
      }
      await sleep(this.#options.intervalMs)
    }
    throw new Error(`check ${checkId} did not finish in ${this.#options.timeoutMs} ms`)
  }

  async #json(path: string, init?: RequestInit): Promise<unknown> {
    const response = await this.#fetch(`${this.#options.baseUrl}${path}`, init)
    if (!response.ok) {
      throw new Error(`${path} answered ${response.status}`)
    }
    return response.json()
  }
}
