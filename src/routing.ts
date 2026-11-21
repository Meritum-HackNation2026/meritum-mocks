// Which platform mock a request is for, and which file under platforms/ serves it.
//   meritum-reddit.gburek.app/        -> platforms/reddit/index.html   (prd)
//   meritum-reddit-dev.gburek.app/    -> platforms/reddit/index.html   (dev)
//   localhost:3000/reddit/            -> platforms/reddit/index.html   (local, path as is)
// The pages link their files as ../assets/..., which from "/" resolves to /assets/.

export const PLATFORMS = ['x', 'facebook', 'instagram', 'reddit', 'tiktok'] as const
export type Platform = (typeof PLATFORMS)[number]

const HOST = /^meritum-(x|facebook|instagram|reddit|tiktok)(?:-dev)?\.gburek\.app(?::\d+)?$/

export function platformOf(host: string | undefined): Platform | null {
  const match = HOST.exec(host ?? '')
  return match ? (match[1] as Platform) : null
}

export function staticPath(path: string, platform: Platform | null): string {
  if (platform === null || path.startsWith('/assets/')) return path
  return `/${platform}${path === '/' ? '/index.html' : path}`
}
