import { SITE_CONFIG } from "@/config/site"

export type ImageSourceKind = "asset" | "public" | "remote"

function normalizeUrl(value: string | undefined): string {
  return (value ?? "").trim().replace(/\/$/, "")
}

function hostnameFromUrl(value: string): string | undefined {
  if (!value) return undefined
  try {
    const url = new URL(value)
    return url.protocol === "https:" ? url.hostname : undefined
  } catch {
    return undefined
  }
}

const publicAssetBaseUrl = normalizeUrl(SITE_CONFIG.assets.publicBaseUrl)
const configuredAssetHost = hostnameFromUrl(publicAssetBaseUrl)

export const ASSET_CONFIG = {
  publicAssetBaseUrl,
  allowedRemoteHosts: [
    ...(configuredAssetHost ? [configuredAssetHost] : []),
    "images.unsplash.com",
  ],
  objectKeyPattern: "posts/{locale}/{slug}/{hash}.{ext}",
}

export function isAllowedRemoteImage(src: string): boolean {
  try {
    const url = new URL(src)
    return (
      url.protocol === "https:" &&
      ASSET_CONFIG.allowedRemoteHosts.some(
        (host) => url.hostname === host || url.hostname.endsWith(`.${host}`)
      )
    )
  } catch {
    return false
  }
}

export function resolveImageSource(src: string): {
  kind: ImageSourceKind
  src: string
} {
  if (/^https:\/\//.test(src)) {
    if (!isAllowedRemoteImage(src)) {
      throw new Error(`Remote image host is not allowed: ${src}`)
    }
    return { kind: "remote", src }
  }

  if (src.startsWith("/")) {
    return { kind: "public", src }
  }

  return { kind: "asset", src }
}

export function optimizeRemoteImageUrl(src: string, width?: number): string {
  try {
    const url = new URL(src)
    if (url.hostname !== "images.unsplash.com") return src

    url.searchParams.set("auto", "format")
    url.searchParams.set("fit", "crop")
    url.searchParams.set("w", String(Math.min(width ?? 720, 720)))
    url.searchParams.set("q", "65")

    return url.toString()
  } catch {
    return src
  }
}
