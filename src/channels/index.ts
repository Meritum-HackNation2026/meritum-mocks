/**
 * Discord mock for the jury (US-WTY-08): the bot conversation, the reply split and the
 * port of the Meritum API.
 *
 * @feature US-WTY-08, F-04
 */
export { answerMessage, receiveMessage } from './_conversation.ts'
export { type ChatMessage, DiscordPage, renderDiscordPage } from './_page.tsx'
export { discordReply } from './_reply.ts'
export {
  DEFAULT_CARD_URL,
  DISCORD_MESSAGE_LIMIT,
  MAX_FORM_BYTES,
  USER_COOKIE,
  USER_COOKIE_MAX_AGE_S,
} from './constants.ts'
export { buildChecksApi } from './factory.ts'
export type { ChecksApi, DiscordCheckRequest } from './ports.ts'
