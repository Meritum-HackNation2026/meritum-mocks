/**
 * Port of the Meritum API the Discord mock calls, the same API as the real bot.
 *
 * @feature US-WTY-08, F-04
 */
import type { CheckRequest, CheckResult } from '../../contracts/meritum.ts'

/**
 * A Discord check: the contract request plus the channel user id the API hashes.
 * shortcut: channel_user_id comes with contract v4 (meritum-core#63); drop the
 * intersection after `pnpm sync` brings it into contracts/meritum.ts.
 *
 * @feature US-WTY-08, F-04
 */
export type DiscordCheckRequest = CheckRequest & { channel: 'discord'; channel_user_id: string }

/**
 * Runs one check through POST /api/v1/checks and waits for its result.
 *
 * @feature US-WTY-08, F-04
 */
export interface ChecksApi {
  /**
   * Send the request and return the finished result.
   *
   * @param request - The Discord check.
   * @returns The CheckResult.
   * @throws {Error} When the API fails or does not finish in time.
   */
  check(request: DiscordCheckRequest): Promise<CheckResult>
}
