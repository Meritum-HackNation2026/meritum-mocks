/**
 * The Discord mock page: a direct conversation with the Meritum bot in a Discord-like
 * frame. Server-rendered, works without JavaScript; the form posts to the same address.
 *
 * @feature US-WTY-08, F-04
 */
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import copy from '../../copy/pl.json' with { type: 'json' }
import { MAX_TEXT_CHARS, MIN_TEXT_CHARS } from './constants.ts'

const read = (path: string) => readFileSync(new URL(path, import.meta.url))
const styles = `${read('../../tokens/meritum.css')}\n${read('./_discord.css')}`
const avatar = `data:image/svg+xml;base64,${read('../../brand/meritum-app-icon.svg').toString('base64')}`

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

/**
 * Props of the Discord mock page.
 *
 * @feature US-WTY-08, F-04
 */
export interface DiscordPageProps {
  /** The conversation, oldest first. */
  messages: ChatMessage[]
}

function Message({ message }: { message: ChatMessage }): React.JSX.Element {
  const isBot = message.author === 'bot'
  return (
    <li>
      {/* biome-ignore lint/performance/noImgElement: Next.js rule; this page is plain server-rendered HTML */}
      {isBot ? <img src={avatar} alt="" /> : <span className="avatar" />}
      <span className="author">{isBot ? copy.brand.name : copy.form.input_label}</span>
      <p className="text">{message.text}</p>
    </li>
  )
}

/**
 * The page body: header with the Meritum mark and name, the conversation, the message box.
 *
 * @param props.messages - The conversation, oldest first.
 * @returns The page body.
 * @feature US-WTY-08, F-04
 */
export function DiscordPage({ messages }: DiscordPageProps): React.JSX.Element {
  return (
    <>
      <header>
        {/* biome-ignore lint/performance/noImgElement: Next.js rule; this page is plain server-rendered HTML */}
        <img src={avatar} alt="" width={24} height={24} />
        <h1>{copy.brand.name}</h1>
      </header>
      <main>
        <ol role="log" aria-live="polite">
          {/* biome-ignore lint/performance/useSolidForComponent: SolidJS rule; this is React */}
          {messages.map((message, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: a static list rendered once on the server
            <Message key={i} message={message} />
          ))}
        </ol>
        <form method="post">
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
}: DiscordPageProps & { theme: 'light' | 'dark' }): string {
  const page = (
    <html lang="pl" data-theme={theme} data-host="discord">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{copy.brand.name}</title>
        <style>{styles}</style>
      </head>
      <body>
        <DiscordPage messages={messages} />
      </body>
    </html>
  )
  return `<!DOCTYPE html>${renderToStaticMarkup(page)}`
}
