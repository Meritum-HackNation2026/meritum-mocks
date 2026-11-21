/**
 * HTTP adapter of the checks port: POST /api/v1/checks, then GET /api/v1/checks/{id}
 * until AnalysisStatus has a result.
 *
 * @feature US-WTY-08, F-04
 */
import { setTimeout as sleep } from 'node:timers/promises'
import type { CheckResult, ClaimResult } from '../../../contracts/meritum.ts'
import type { ChecksApi, DiscordCheckRequest } from '../ports.ts'

const statuses: ReadonlySet<unknown> = new Set<CheckResult['status']>([
  'done',
  'needs_clarification',
  'out_of_scope',
  'technical_failure',
])
const verdicts: ReadonlySet<unknown> = new Set<ClaimResult['verdict']>([
  'confirmed',
  'false',
  'misleading',
  'insufficient_evidence',
  'not_verifiable',
])

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

function isClaim(value: unknown): boolean {
  return isRecord(value) && typeof value['claim'] === 'string' && verdicts.has(value['verdict'])
}

// Trust boundary: the fields the channel reads must be there and known; the API owns the rest.
function checked(value: unknown): CheckResult | null {
  if (!isRecord(value)) {
    return null
  }
  const claims = value['claims'] ?? []
  const isResult =
    typeof value['check_id'] === 'string' &&
    statuses.has(value['status']) &&
    Array.isArray(claims) &&
    claims.every(isClaim)
  return isResult ? (value as unknown as CheckResult) : null
}

function validResult(value: unknown): CheckResult {
  const result = checked(value)
  if (result === null) {
    throw new Error('GET /api/v1/checks/{id} answered with a result the channel cannot read')
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
    const checkId = isRecord(started) ? started['check_id'] : undefined
    if (typeof checkId !== 'string') {
      throw new Error('POST /api/v1/checks answered without check_id')
    }
    const deadline = Date.now() + this.#options.timeoutMs
    while (Date.now() < deadline) {
      // biome-ignore lint/performance/noAwaitInLoops: polling is sequential by design
      const status = await this.#json(`/api/v1/checks/${encodeURIComponent(checkId)}`)
      const result = isRecord(status) ? status['result'] : null
      if (result !== null && result !== undefined) {
        return validResult(result)
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
