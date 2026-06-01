import mdx from "@astrojs/mdx"
import partytown from "@astrojs/partytown"
import sitemap from "@astrojs/sitemap"
import { satteri } from "@astrojs/markdown-satteri"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, svgoOptimizer } from "astro/config"
import icon from "astro-icon"
import pagefind from "./src/integrations/pagefind.ts"
import { SITE_CONFIG } from "./src/config/site.ts"

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
  site: SITE_CONFIG.url,
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
    remotePatterns: SITE_CONFIG.assets.remotePatterns,
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
    processor: satteri(),
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
    rustCompiler: true,
    queuedRendering: {
      enabled: true,
      contentCache: true,
    },
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
