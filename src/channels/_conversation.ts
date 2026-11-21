/**
 * One user message to the bot of the Discord mock: recognise the user, validate, check
 * through the API, answer like the bot.
 *
 * @feature US-WTY-08, F-04
 */
import { randomUUID } from 'node:crypto'
import copy from '../../copy/pl.json' with { type: 'json' }
import type { ChatMessage } from './_page.tsx'
import { discordReply, statusMessage, toDiscord } from './_reply.ts'
import { CHECK_ID_PLACEHOLDER, MAX_TEXT_CHARS, MIN_TEXT_CHARS, MOCK_USER_ID } from './constants.ts'
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
    return toDiscord([[error]], message.firstContact)
  }
  try {
    const result = await api.check({ channel: 'discord', text, channel_user_id: message.userId })
    const cardUrl = cardUrlTemplate.replace(
      CHECK_ID_PLACEHOLDER,
      encodeURIComponent(result.check_id),
    )
    return discordReply(result, { cardUrl, firstContact: message.firstContact })
  } catch (failure) {
    console.error('Discord mock check failed', failure)
    return toDiscord([statusMessage('technical_failure')], message.firstContact)
  }
}

/**
 * A form post to the mock: the user id comes from the cookie, and a missing or malformed
 * cookie means a new user (first contact) with a fresh random id.
 *
 * @param api - The checks port.
 * @param input.text - The text from the form.
 * @param input.cookie - The mock user cookie, if the browser sent one.
 * @param cardUrlTemplate - Result card link with `{check_id}`.
 * @returns The user id to keep in the cookie and the conversation to show.
 * @feature US-WTY-08, F-04
 */
export async function receiveMessage(
  api: ChecksApi,
  input: { text: string; cookie: string | undefined },
  cardUrlTemplate: string,
): Promise<{ userId: string; messages: ChatMessage[] }> {
  const known = input.cookie !== undefined && MOCK_USER_ID.test(input.cookie) ? input.cookie : null
  const userId = known ?? randomUUID()
  const replies = await answerMessage(
    api,
    { text: input.text, userId, firstContact: known === null },
    cardUrlTemplate,
  )
  return {
    userId,
    messages: [
      { author: 'user', text: input.text },
      ...replies.map((text): ChatMessage => ({ author: 'bot', text })),
    ],
  }
}
