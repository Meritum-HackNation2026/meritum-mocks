/**
 * One user message to the bot of the Discord mock: validate, check through the API,
 * answer like the bot.
 *
 * @feature US-WTY-08, F-04
 */
import copy from '../../copy/pl.json' with { type: 'json' }
import { discordReply, splitMessage, statusMessage, withAiNotice } from './_reply.ts'
import { MAX_TEXT_CHARS, MIN_TEXT_CHARS } from './constants.ts'
import type { ChecksApi } from './ports.ts'

/**
 * A message the user typed in the mock.
 *
 * @feature US-WTY-08, F-04
 */
export interface UserMessage {
  /** What the user wrote. */
  text: string
  /** Random id of the mock user, sent as channel_user_id. */
  userId: string
  /** First message from this user. */
  firstContact: boolean
}

function inputError(text: string): string | null {
  if (text.length < MIN_TEXT_CHARS) {
    return copy.errors.empty
  }
  return text.length > MAX_TEXT_CHARS ? copy.errors.too_long : null
}

/**
 * The bot's messages in answer to one user message.
 *
 * @param api - The checks port.
 * @param message - What the user sent.
 * @param cardUrlTemplate - Result card link with `{check_id}`.
 * @returns The bot's messages.
 * @feature US-WTY-08, F-04
 */
export async function answerMessage(
  api: ChecksApi,
  message: UserMessage,
  cardUrlTemplate: string,
): Promise<string[]> {
  const text = message.text.trim()
  const error = inputError(text)
  if (error !== null) {
    return reply(error, message.firstContact)
  }
  try {
    const result = await api.check({ channel: 'discord', text, channel_user_id: message.userId })
    const cardUrl = cardUrlTemplate.replace('{check_id}', encodeURIComponent(result.check_id))
    return discordReply(result, { cardUrl, firstContact: message.firstContact })
  } catch (failure) {
    console.error('Discord mock check failed', failure)
    return reply(statusMessage('technical_failure'), message.firstContact)
  }
}

function reply(text: string, firstContact: boolean): string[] {
  return withAiNotice([text], firstContact).flatMap((m) => splitMessage(m))
}
