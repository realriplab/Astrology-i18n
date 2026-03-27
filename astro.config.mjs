import astroExpressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import pagefind from 'astro-pagefind';
import { defineConfig } from 'astro/config';
import { remarkModifiedTime } from './src/utils/remark-modified-time.mjs';

export default defineConfig({
  output: 'static',
  site: 'https://astrology.idimi.com',
  cacheDir: './astro_cache',
  trailingSlash: 'always',
  build: {
    concurrency: 6,
  },

  prefetch: {
    defaultStrategy: 'viewport',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['zh', 'en', 'fr', 'es', 'ru', 'ja', 'ko', 'pt', 'de', 'id'],
    routing: 'manual',
  },

  image: {
    responsiveStyles: true,
    layout: 'constrained',
    service: {
      config: {
        jpeg: { mozjpeg: true },
        webp: { effort: 6, alphaQuality: 80 },
        avif: { effort: 4, chromaSubsampling: '4:2:0' },
        png: { compressionLevel: 9 },
      },
    },
    remotePatterns: [{ protocol: 'https', hostname: '*.unsplash.com' }],
  },

  markdown: {
    remarkPlugins: [remarkModifiedTime],
  },

  integrations: [
    astroExpressiveCode({
      themes: ['github-dark', 'github-light'],
      themeCssSelector: (theme) => (theme.type === 'dark' ? '.dark' : ''),
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          zh: 'zh-CN',
          en: 'en-US',
          fr: 'fr-FR',
          es: 'es-ES',
          ru: 'ru-RU',
          ja: 'ja-JP',
          ko: 'ko-KR',
          pt: 'pt-PT',
          de: 'de-DE',
          id: 'id-ID',
        },
      },
    }),
    mdx(),
    pagefind(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    icon({
      include: {
        lucide: ['github', 'globe', 'menu', 'monitor', 'moon', 'rss', 'search', 'sun', 'x'],
      },
    }),
  ],
});
