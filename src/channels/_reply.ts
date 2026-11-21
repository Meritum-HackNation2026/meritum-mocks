/**
 * The bot's answer as Discord messages, by the same rules as the real bot (backend/007):
 * a summary with every verdict and the card link, then one message per claim with its
 * verdict, one quote with the source and the strength; each message up to 2000 characters.
 *
 * @feature US-WTY-08, F-04
 */
import type { CheckResult, Citation, ClaimResult } from '../../contracts/meritum.ts'
import copy from '../../copy/pl.json' with { type: 'json' }
import { DISCORD_MESSAGE_LIMIT } from './constants.ts'

/**
 * What the reply depends on besides the result.
 *
 * @feature US-WTY-08, F-04
 */
export interface ReplyOptions {
  /** Link to the full result card. */
  cardUrl: string
  /** First message from this user: the reply opens with the AI notice. */
  firstContact: boolean
}

type NotDone = Exclude<CheckResult['status'], 'done'>

const placeholder = /\{(\w+)\}/g
const publicationDate = new Intl.DateTimeFormat('pl-PL', {
  dateStyle: 'long',
  timeZone: 'Europe/Warsaw',
})
// copy has "{publisher}, data publikacji nieznana"; the claim template already names the publisher.
const undated = copy.result.source_undated.replace('{publisher}, ', '')

function fill(template: string, values: Record<string, string>): string {
  return template.replace(placeholder, (match, key: string) => values[key] ?? match)
}

function summary(claims: ClaimResult[], cardUrl: string): string {
  const head = fill(copy.discord.summary, { count: String(claims.length), link: cardUrl })
  const lines = claims.map((c) =>
    fill(copy.discord.summary_line, { verdict: copy.verdict[c.verdict], claim: c.claim }),
  )
  return [head, ...lines].join('\n')
}

function mainCitation(claim: ClaimResult): Citation | undefined {
  return claim.citations?.find((c) => c.stance !== 'context') ?? claim.citations?.[0]
}

function claimMessage(claim: ClaimResult): string {
  const verdict = copy.verdict[claim.verdict]
  const citation = mainCitation(claim)
  if (citation === undefined) {
    const unresolved = claim.unresolved ?? claim.explanation
    return fill(copy.discord.claim_unsettled, { verdict, claim: claim.claim, unresolved })
  }
  const published = citation.source.published_at
  const template = claim.strength
    ? copy.discord.claim
    : copy.discord.claim
        .split('\n')
        .filter((line) => !line.includes('{strength}'))
        .join('\n')
  return fill(template, {
    verdict,
    claim: claim.claim,
    fragment: citation.fragment,
    publisher: citation.source.publisher,
    date: published ? publicationDate.format(new Date(published)) : undated,
    strength: claim.strength ? copy.strength[claim.strength.level] : '',
  })
}

/**
 * The message for a check that ended without claims, or failed.
 *
 * @param status - The state of the check.
 * @returns The status word and its hint, both from copy/pl.json.
 * @feature US-WTY-08, F-04
 */
export function statusMessage(status: NotDone): string {
  return `${copy.status[status]}\n${copy.status_hint[status]}`
}

/**
 * Lines packed into messages of at most `limit` characters, never splitting a line.
 * A quote line fits by contract (fragment 600, publisher 120 characters), so only a
 * line longer than the limit, which the contract excludes, is cut.
 *
 * @param text - The message.
 * @param limit - Most characters per message.
 * @returns The messages.
 * @feature US-WTY-08, F-04
 */
export function splitMessage(text: string, limit = DISCORD_MESSAGE_LIMIT): string[] {
  const lines = text
    .split('\n')
    .flatMap((line) =>
      Array.from({ length: Math.max(1, Math.ceil(line.length / limit)) }, (_, i) =>
        line.slice(i * limit, (i + 1) * limit),
      ),
    )
  const messages: string[] = []
  let current: string | null = null
  for (const line of lines) {
    const joined: string = current === null ? line : `${current}\n${line}`
    if (current !== null && joined.length > limit) {
      messages.push(current)
      current = line
    } else {
      current = joined
    }
  }
  return current === null ? messages : [...messages, current]
}

/**
 * Prepend the AI notice to the first message for a new user.
 *
 * @param messages - The reply.
 * @param firstContact - Whether this is the user's first message.
 * @returns The reply, with the notice when needed.
 * @feature US-WTY-08, F-04
 */
export function withAiNotice(messages: string[], firstContact: boolean): string[] {
  const [first, ...rest] = messages
  return firstContact && first !== undefined
    ? [`${copy.ai_notice.discord}\n${first}`, ...rest]
    : messages
}

/**
 * The bot's reply to one check as Discord messages.
 *
 * @param result - The CheckResult from the API.
 * @param options - Card link and first contact.
 * @returns The messages in sending order, each at most 2000 characters.
 * @feature US-WTY-08, F-04
 */
export function discordReply(result: CheckResult, options: ReplyOptions): string[] {
  const claims = result.claims ?? []
  const messages =
    result.status === 'done'
      ? [summary(claims, options.cardUrl), ...claims.map(claimMessage)]
      : [statusMessage(result.status)]
  return withAiNotice(messages, options.firstContact).flatMap((m) => splitMessage(m))
}
