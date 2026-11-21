/**
 * The bot's answer as Discord messages, by the same rules as the real bot (backend/007):
 * a summary with every verdict and the card link, then one message per claim with its
 * verdict, one quote with the source and the strength; each message up to 2000 characters.
 *
 * @feature US-WTY-08, F-04
 */
import type { CheckResult, Citation, ClaimResult } from '../../contracts/meritum.ts'
import copy from '../../copy/pl.json' with { type: 'json' }
import { DISCORD_MESSAGE_LIMIT, LOCALE, TIME_ZONE } from './constants.ts'

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

/** One bot message as its template lines; packing never splits inside a line. */
type Lines = string[]

const placeholder = /\{(\w+)\}/g
const publicationDate = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long', timeZone: TIME_ZONE })
// copy has "{publisher}, data publikacji nieznana"; the claim template already names the publisher.
const undated = copy.result.source_undated.replace('{publisher}, ', '')

// Fill each template line on its own, so a value with a line break stays inside its line.
function fill(template: string, values: Record<string, string>): Lines {
  return template
    .split('\n')
    .map((line) => line.replace(placeholder, (match, key: string) => values[key] ?? match))
}

function summary(claims: ClaimResult[], cardUrl: string): Lines {
  const head = fill(copy.discord.summary, { count: String(claims.length), link: cardUrl })
  const lines = claims.flatMap((c) =>
    fill(copy.discord.summary_line, { verdict: copy.verdict[c.verdict], claim: c.claim }),
  )
  return [...head, ...lines]
}

function mainCitation(claim: ClaimResult): Citation | undefined {
  return claim.citations?.find((c) => c.stance !== 'context') ?? claim.citations?.[0]
}

function claimMessage(claim: ClaimResult): Lines {
  const verdict = copy.verdict[claim.verdict]
  const citation = mainCitation(claim)
  if (citation === undefined) {
    const unresolved = claim.unresolved ?? claim.explanation
    return fill(copy.discord.claim_unsettled, { verdict, claim: claim.claim, unresolved })
  }
  const published = citation.source.published_at
  // Without a strength (non-decisive verdicts) the template's strength line is left out.
  const template = copy.discord.claim
    .split('\n')
    .filter((line) => claim.strength || !line.includes('{strength}'))
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
export function statusMessage(status: NotDone): Lines {
  return [copy.status[status], copy.status_hint[status]]
}

function cut(line: string, limit: number): string[] {
  const pieces = Math.max(1, Math.ceil(line.length / limit))
  return Array.from({ length: pieces }, (_, i) => line.slice(i * limit, (i + 1) * limit))
}

/**
 * Template lines packed into messages of at most `limit` characters, never splitting a line,
 * so the quote line is never cut. Only a line longer than the limit is cut, which the
 * contract excludes (meritum.schema.json: fragment 600, publisher 120, claim 500 characters).
 *
 * @param lines - The message as template lines.
 * @param limit - Most characters per message.
 * @returns The messages.
 * @feature US-WTY-08, F-04
 */
function splitMessage(lines: Lines, limit = DISCORD_MESSAGE_LIMIT): string[] {
  const messages: string[] = []
  let current: string | null = null
  for (const line of lines.flatMap((l) => cut(l, limit))) {
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
 * The reply as Discord messages: the AI notice first for a new user, then each message
 * packed to the limit.
 *
 * @param messages - The reply, each message as template lines.
 * @param firstContact - Whether this is the user's first message.
 * @returns The messages in sending order.
 * @feature US-WTY-08, F-04
 */
export function toDiscord(messages: Lines[], firstContact: boolean): string[] {
  const [first, ...rest] = messages
  const withNotice =
    firstContact && first !== undefined ? [[copy.ai_notice.discord, ...first], ...rest] : messages
  return withNotice.flatMap((m) => splitMessage(m))
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
  return toDiscord(messages, options.firstContact)
}
