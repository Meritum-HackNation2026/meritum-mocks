/**
 * The Discord mock page: a direct conversation with the Meritum bot in a Discord-like
 * frame. Server-rendered, works without JavaScript; the form posts to the same address and
 * the browser lands on the new reply.
 *
 * @feature US-WTY-08, F-04
 */
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import copy from '../../copy/pl.json' with { type: 'json' }
import { MAX_TEXT_CHARS, MIN_TEXT_CHARS, REPLY_ANCHOR } from './constants.ts'

const read = (path: string) => readFileSync(new URL(path, import.meta.url))
const svg = (path: string) => `data:image/svg+xml;base64,${read(path).toString('base64')}`
const styles = `${read('../../tokens/meritum.css')}\n${read('./_discord.css')}`
const avatar = svg('../../brand/meritum-app-icon.svg')
const marks = {
  light: svg('../../brand/meritum-mark.svg'),
  dark: svg('../../brand/meritum-mark-on-dark.svg'),
}
// A URL ends before whitespace, a closing quote or bracket, and trailing punctuation.
const url = /(https?:\/\/[^\s"”)]*[^\s"”).,;:!?])/

/**
 * One message of the conversation.
 *
 * @feature US-WTY-08, F-04
 */
export interface ChatMessage {
  /** Who wrote it. */
  author: 'user' | 'bot'
  /** The message content. */
  text: string
}

type Theme = 'light' | 'dark'

/**
 * Props of the Discord mock page.
 *
 * @feature US-WTY-08, F-04
 */
export interface DiscordPageProps {
  /** The conversation, oldest first. */
  messages: ChatMessage[]
  /** Colour theme; picks the mark drawn for light or dark ground. */
  theme?: Theme
}

// Links become clickable, as Discord does; the split keeps URLs at odd indexes.
function Linked({ text }: { text: string }): React.JSX.Element {
  const parts = text.split(url)
  return (
    <>
      {/* biome-ignore lint/performance/useSolidForComponent: SolidJS rule; this is React */}
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: parts of one static string
          <a key={i} href={part}>
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  )
}

function Message(props: { message: ChatMessage; isReply: boolean }): React.JSX.Element {
  const isBot = props.message.author === 'bot'
  const target = props.isReply ? { id: REPLY_ANCHOR, tabIndex: -1 } : {}
  return (
    <li {...target}>
      {/* biome-ignore lint/performance/noImgElement: Next.js rule; this page is plain server-rendered HTML */}
      {isBot ? <img src={avatar} alt="" /> : <span className="avatar" />}
      <span className="author">{isBot ? copy.brand.name : copy.discord.user_author}</span>
      <p className="text">
        <Linked text={props.message.text} />
      </p>
    </li>
  )
}

/**
 * The page body: header with the Meritum mark and name, the conversation, the message box.
 *
 * @param props.messages - The conversation, oldest first.
 * @param props.theme - Colour theme, light by default.
 * @returns The page body.
 * @feature US-WTY-08, F-04
 */
export function DiscordPage({ messages, theme = 'light' }: DiscordPageProps): React.JSX.Element {
  const reply = messages.findLastIndex((m) => m.author === 'user') + 1
  return (
    <>
      <header>
        {/* biome-ignore lint/performance/noImgElement: Next.js rule; this page is plain server-rendered HTML */}
        <img src={marks[theme]} alt="" width={14} height={14} />
        <h1>{copy.brand.name}</h1>
      </header>
      <main>
        <ol role="log" aria-live="polite">
          {/* biome-ignore lint/performance/useSolidForComponent: SolidJS rule; this is React */}
          {messages.map((message, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: a static list rendered once on the server
            <Message key={i} message={message} isReply={reply > 0 && i === reply} />
          ))}
        </ol>
        <form method="post" action={`#${REPLY_ANCHOR}`}>
          <label htmlFor="text">{copy.form.input_label}</label>
          <textarea
            id="text"
            name="text"
            required={true}
            minLength={MIN_TEXT_CHARS}
            maxLength={MAX_TEXT_CHARS}
            placeholder={copy.form.input_placeholder}
          />
          <button type="submit">{copy.form.submit}</button>
        </form>
      </main>
    </>
  )
}

/**
 * The whole HTML document of the Discord mock.
 *
 * @param props.messages - The conversation, oldest first.
 * @param props.theme - `dark` for the dark tokens (`?theme=dark`, as on the other mocks).
 * @returns The HTML, starting with the doctype.
 * @feature US-WTY-08, F-04
 */
export function renderDiscordPage({
  messages,
  theme,
}: DiscordPageProps & { theme: Theme }): string {
  const page = (
    <html lang="pl" data-theme={theme} data-host="discord">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{copy.brand.name}</title>
        <style>{styles}</style>
      </head>
      <body>
        <DiscordPage messages={messages} theme={theme} />
      </body>
    </html>
  )
  return `<!DOCTYPE html>${renderToStaticMarkup(page)}`
}
