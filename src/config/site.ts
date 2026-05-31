export type HomepageLayout = "cover" | "archive" | "text"
export type X402ChargeMode = "all" | "bot-only"

function normalizeGoogleTagManagerId(value: string | undefined): string {
  const id = (value ?? "").trim()
  return /^GTM-[A-Z0-9]+$/i.test(id) ? id.toUpperCase() : ""
}

function normalizeGoogleAdsenseClientId(value: string | undefined): string {
  const id = (value ?? "").trim()
  return /^ca-pub-\d+$/i.test(id) ? id : ""
}

function normalizePublicString(value: string | undefined): string {
  return (value ?? "").trim()
}

function normalizeX402ChargeMode(value: string | undefined): X402ChargeMode {
  const mode = normalizePublicString(value).toLowerCase()
  return mode === "bot-only" || mode === "bots" ? "bot-only" : "all"
}

function normalizeBotScoreThreshold(value: string | undefined): number {
  const threshold = Number.parseInt(normalizePublicString(value), 10)
  if (!Number.isFinite(threshold)) return 30
  return Math.min(99, Math.max(1, threshold))
}

const googleTagManagerId = normalizeGoogleTagManagerId(
  import.meta.env.PUBLIC_GTM_ID
)
const googleAdsenseClientId = normalizeGoogleAdsenseClientId(
  import.meta.env.PUBLIC_ADSENSE_CLIENT_ID
)
const publicAssetBaseUrl = normalizePublicString(
  import.meta.env.PUBLIC_ASSET_BASE_URL
).replace(/\/$/, "")
const x402PayTo = normalizePublicString(import.meta.env.PUBLIC_X402_PAY_TO)
const x402Network = normalizePublicString(
  import.meta.env.PUBLIC_X402_NETWORK ??
    "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"
)
const x402Price = normalizePublicString(
  import.meta.env.PUBLIC_X402_PRICE ?? "$0.01"
)
const x402Description = normalizePublicString(
  import.meta.env.PUBLIC_X402_DESCRIPTION ??
    "Voluntary x402 payment support for Polyglow content."
)
const x402FacilitatorUrl = normalizePublicString(
  import.meta.env.PUBLIC_X402_FACILITATOR_URL
)
const x402ChargeMode = normalizeX402ChargeMode(
  import.meta.env.PUBLIC_X402_CHARGE_MODE
)
const x402BotScoreThreshold = normalizeBotScoreThreshold(
  import.meta.env.PUBLIC_X402_BOT_SCORE_THRESHOLD
)
const socialXUrl = "https://x.com/realriplabs"
const socialXHandle = `@${
  new URL(socialXUrl).pathname.split("/").filter(Boolean)[0] ?? "polyglow"
}`

export const SITE_CONFIG = {
  name: "Polyglow",
  url: (
    import.meta.env.PUBLIC_SITE_URL ?? "https://polyglow.realrip.com"
  ).replace(/\/$/, ""),
  description:
    "Pressing forward through the waves of startup, the fog of investing, and the ocean of life.",
  repository: "https://github.com/realriplab/Polyglow",
  social: {
    x: socialXUrl,
    xHandle: socialXHandle,
  },
  defaultOgImage: "/open-graph.webp",
  assets: {
    publicBaseUrl: publicAssetBaseUrl,
  },
  homepage: {
    layout: "cover" as HomepageLayout,
  },
  analytics: {
    googleTagManager: {
      enabled: import.meta.env.PUBLIC_GTM_ENABLED === "true",
      containerId: googleTagManagerId,
    },
    googleAdsense: {
      enabled: import.meta.env.PUBLIC_ADSENSE_ENABLED === "true",
      clientId: googleAdsenseClientId,
    },
  },
  payments: {
    x402: {
      enabled: import.meta.env.PUBLIC_X402_ENABLED === "true",
      payTo: x402PayTo,
      network: x402Network,
      price: x402Price,
      description: x402Description,
      facilitatorUrl: x402FacilitatorUrl,
      chargeMode: x402ChargeMode,
      botScoreThreshold: x402BotScoreThreshold,
    },
  },
}
