import expressiveCode from "astro-expressive-code"
import mdx from "@astrojs/mdx"
import partytown from "@astrojs/partytown"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, svgoOptimizer } from "astro/config"
import icon from "astro-icon"
import pagefind from "./src/integrations/pagefind.ts"

const assetHost = (() => {
  if (!process.env.PUBLIC_ASSET_BASE_URL) return undefined
  try {
    const url = new URL(process.env.PUBLIC_ASSET_BASE_URL)
    return url.protocol === "https:" ? url.hostname : undefined
  } catch {
    return undefined
  }
})()

const googleTagManagerEnabled =
  process.env.PUBLIC_GTM_ENABLED === "true" &&
  /^GTM-[A-Z0-9]+$/i.test(process.env.PUBLIC_GTM_ID ?? "")
const sitemapLocaleMap = {
  en: "en-US",
  zh: "zh-CN",
  fr: "fr-FR",
  es: "es-ES",
  ru: "ru-RU",
  ja: "ja-JP",
  ko: "ko-KR",
  pt: "pt-PT",
  de: "de-DE",
  id: "id-ID",
  ar: "ar",
}

export default defineConfig({
  output: "static",
  site: process.env.PUBLIC_SITE_URL ?? "https://example.com",
  trailingSlash: "always",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  build: {
    concurrency: 6,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh", "fr", "es", "ru", "ja", "ko", "pt", "de", "id", "ar"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
    remotePatterns: [
      ...(assetHost ? [{ protocol: "https", hostname: assetHost }] : []),
      { protocol: "https", hostname: "*.unsplash.com" },
    ],
    service: {
      config: {
        jpeg: { mozjpeg: true },
        webp: { effort: 6, alphaQuality: 80 },
        avif: { effort: 4, chromaSubsampling: "4:2:0" },
        png: { compressionLevel: 9 },
      },
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      wrap: true,
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer({
      multipass: true,
      floatPrecision: 2,
      plugins: ["preset-default"],
    }),
  },
  integrations: [
    ...(googleTagManagerEnabled
      ? [
          partytown({
            config: {
              forward: ["dataLayer.push"],
            },
          }),
        ]
      : []),
    icon({
      include: {
        lucide: [
          "arrow-left",
          "chevron-down",
          "chevron-left",
          "chevron-right",
          "eye",
          "github",
          "globe",
          "menu",
          "monitor",
          "moon",
          "newspaper",
          "rss",
          "search",
          "sun",
          "x",
        ],
      },
    }),
    expressiveCode({
      themes: ["github-dark", "github-light"],
      themeCssSelector: (theme) => (theme.type === "dark" ? ".dark" : ""),
    }),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page)
        return pathname !== "/" && !pathname.endsWith("/search/")
      },
      i18n: {
        defaultLocale: "en",
        locales: sitemapLocaleMap,
      },
      serialize: (item) => {
        if (!item.links?.length) return item
        const links = new Map(item.links.map((link) => [link.lang, link.url]))
        const defaultUrl = links.get(sitemapLocaleMap.en)
        if (defaultUrl) links.set("x-default", defaultUrl)
        return {
          ...item,
          links: [...links].map(([lang, url]) => ({ lang, url })),
        }
      },
    }),
    mdx(),
    pagefind(),
  ],
})
