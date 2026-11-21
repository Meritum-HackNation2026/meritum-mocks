/**
 * Which platform mock a request is for, and which file under platforms/ serves it.
 *   meritum-reddit.gburek.app/        -> platforms/reddit/index.html   (prd)
 *   meritum-reddit-dev.gburek.app/    -> platforms/reddit/index.html   (dev)
 *   localhost:3000/reddit/            -> platforms/reddit/index.html   (local, path as is)
 * The pages link their files as ../assets/..., which from "/" resolves to /assets/.
 *
 * @feature US-WTY-01, ADR-10
 */
import { PLATFORM_HOST, type PLATFORMS } from './constants.ts'

/**
 * One of the mocked platforms.
 *
 * @feature US-WTY-01, ADR-10
 */
export type Platform = (typeof PLATFORMS)[number]

/**
 * The platform a request is for, from its Host header.
 *
 * @param host - The Host header, if any.
 * @returns The platform, or null for any other host.
 * @feature US-WTY-01, ADR-10
 */
export function platformOf(host: string | undefined): Platform | null {
  const match = PLATFORM_HOST.exec(host ?? '')
  return match ? (match[1] as Platform) : null
}

/**
 * The file under platforms/ that serves a request path.
 *
 * @param path - The request path.
 * @param platform - The platform from the host, or null on localhost.
 * @returns The path under platforms/.
 * @feature US-WTY-01, ADR-10
 */
export function staticPath(path: string, platform: Platform | null): string {
  if (platform === null || path.startsWith('/assets/')) {
    return path
  }
  return `/${platform}${path === '/' ? '/index.html' : path}`
}
