export type HomepageLayout = "cover" | "archive" | "text"

function normalizeGoogleTagManagerId(value: string | undefined): string {
  const id = (value ?? "").trim()
  return /^GTM-[A-Z0-9]+$/i.test(id) ? id.toUpperCase() : ""
}

function normalizeGoogleAdsenseClientId(value: string | undefined): string {
  const id = (value ?? "").trim()
  return /^ca-pub-\d+$/i.test(id) ? id : ""
}

const googleTagManagerId = normalizeGoogleTagManagerId(
  import.meta.env.PUBLIC_GTM_ID ?? "GTM-5QW2732G"
)
const googleAdsenseClientId = normalizeGoogleAdsenseClientId(
  import.meta.env.PUBLIC_ADSENSE_CLIENT_ID ?? "ca-pub-4552045179808692"
)

export const SITE_CONFIG = {
  name: "Polyglow",
  url: (
    import.meta.env.PUBLIC_SITE_URL ?? "https://polyglow.realrip.com"
  ).replace(/\/$/, ""),
  description:
    "A multilingual Astro content site with glassmorphism cards and static publishing.",
  repository: "https://github.com/realriplab/Polyglow",
  social: {
    x: "https://x.com/realriplabs",
  },
  defaultOgImage: "/open-graph.webp",
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
}
