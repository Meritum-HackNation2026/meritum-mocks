/**
 * Constants of the Discord mock.
 *
 * @feature US-WTY-08, F-04
 */

/**
 * Most characters in one Discord message from a bot (API limit), the same as the real bot.
 *
 * @feature US-WTY-08, F-04
 */
export const DISCORD_MESSAGE_LIMIT = 2000

/**
 * Most characters of checked text, as in CheckRequest.text of the contract.
 *
 * @feature US-WTY-08, F-04
 */
export const MAX_TEXT_CHARS = 4000

/**
 * Fewest characters of checked text; shorter input gets copy errors.empty.
 *
 * @feature US-WTY-08, F-04
 */
export const MIN_TEXT_CHARS = 3

/**
 * Meritum API used when MERITUM_API_URL is unset: the prd API behind the web app.
 *
 * @feature US-WTY-08, F-04
 */
export const DEFAULT_API_URL = 'https://meritum.gburek.app'

/**
 * Result card link used when MERITUM_CARD_URL is unset; `{check_id}` is replaced.
 *
 * @feature US-WTY-08, F-04
 */
export const DEFAULT_CARD_URL = 'https://meritum.gburek.app/?check={check_id}'

/**
 * Pause between two GET /api/v1/checks/{id} calls while a check runs.
 *
 * @feature US-WTY-08, F-04
 */
export const POLL_INTERVAL_MS = 1000

/**
 * Longest wait for a check result before the mock answers with a technical problem.
 *
 * @feature US-WTY-08, F-04
 */
export const POLL_TIMEOUT_MS = 90_000

/**
 * Cookie with the random user id of the mock; its absence means first contact.
 *
 * @feature US-WTY-08, F-04
 */
export const USER_COOKIE = 'meritum_discord_user'

/**
 * Lifetime of the mock user cookie: 30 days, after which the user counts as new.
 *
 * @feature US-WTY-08, F-04
 */
export const USER_COOKIE_MAX_AGE_S = 30 * 24 * 60 * 60
