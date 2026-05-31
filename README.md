# Polyglow

[中文说明](readme-zh.md)

Polyglow is a static Astro 6 theme for multilingual editorial publishing. It
ships locale-prefixed routes, content collections, category and tag archives,
author pages, Pagefind search, RSS, sitemap output, SEO metadata through
`astro-seo`, JSON-LD, Astro image optimization, light/dark themes, Astro view
transitions, and optional Cloudflare Workers Static Assets deployment.

The theme works without a database, private service, analytics account, ad
account, wallet, or Cloudflare credentials.

## Requirements

- Node.js 22 or newer
- pnpm

## Start

```bash
pnpm install
pnpm dev
```

Astro prints the local URL. The root entry redirects to the English locale:

```text
http://localhost:4321/en/
```

## Commands

```bash
pnpm dev      # Start local development
pnpm build    # Run astro check and build static output
pnpm preview  # Preview the built site locally
pnpm deploy   # Build, then deploy dist with Wrangler
```

## Project Structure

```text
astro.config.mjs             # Astro, i18n, image, sitemap, and integration config
src/config/                  # Site, locale, taxonomy, pagination, and asset config
src/content/                 # Authors, pages, and posts
src/pages/                   # Localized routes and generated endpoints
src/layouts/main.astro       # Shared shell, SEO, widgets, header, and footer
src/components/              # Cards, layout, navigation, search, widgets, and icons
src/integrations/pagefind.ts # Pagefind build and dev integration
src/styles/global.css        # Runtime Tailwind v4 theme and component CSS
src/styles/design-theme.css  # Token reference generated from DESIGN.md
```

## Routes and Locales

Configured locales:

```text
en zh fr es ru ja ko pt de id ar
```

`en` is the default locale. Public pages are locale-prefixed and keep trailing
slashes:

```text
/en/
/en/posts/
/en/posts/<slug>/
/en/category/
/en/category/<slug>/
/en/tags/
/en/tags/<slug>/
/en/author/
/en/search/
/en/rss.xml
```

Chinese content remains available under `/zh/`. Arabic routes use RTL layout
through locale metadata.

## Write Content

Content lives in `src/content`:

```text
src/content/
  authors/<locale>/
  pages/<locale>/
  posts/<locale>/
```

Post example:

```text
src/content/posts/en/my-post.mdx
src/content/posts/zh/my-post.mdx
```

Post frontmatter:

```yaml
---
title: "Post title"
description: "Short summary for cards and SEO."
category: "build"
tags: ["strategy"]
pubDate: 2026-05-12
updatedDate: 2026-05-12
authors: ["default"]
heroImage: "/open-graph.webp"
heroImageAlt: "Image alt text"
locale: "en"
draft: false
featured: false
---
```

Optional SEO fields:

```yaml
seoTitle: "Custom title"
seoDescription: "Custom meta description."
canonical: "https://example.com/original/"
heroBlurDataURL: "data:image/..."
```

Remote `heroImage` values must include `heroImageWidth` and
`heroImageHeight`. Remote image hosts are limited to Unsplash and the optional
`PUBLIC_ASSET_BASE_URL` host.

## Configure

Most users only need `src/config/site.ts`:

```text
src/config/site.ts       # Site name, URL, description, repository, social links, homepage, assets, analytics, ads, x402
src/config/locales.ts    # Locale list, default locale, hreflang, direction
src/config/taxonomy.ts   # Categories, tags, localized labels, slug helpers
src/config/pagination.ts # Page sizes
src/config/assets.ts     # Remote image host checks and URL helpers
src/i18n/*.json          # Interface text
```

Environment variables are optional deployment overrides for values that often
change by environment:

```bash
PUBLIC_SITE_URL=https://example.com
PUBLIC_ASSET_BASE_URL=https://assets.example.com
```

Optional integrations are disabled by default:

```bash
PUBLIC_GTM_ENABLED=true
PUBLIC_GTM_ID=GTM-XXXXXXX

PUBLIC_ADSENSE_ENABLED=true
PUBLIC_ADSENSE_CLIENT_ID=ca-pub-0000000000000000

PUBLIC_X402_ENABLED=true
PUBLIC_X402_PAY_TO=YourWalletAddress
PUBLIC_X402_NETWORK=solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1
PUBLIC_X402_PRICE=$0.01
PUBLIC_X402_DESCRIPTION=Voluntary x402 payment support for Polyglow content.
PUBLIC_X402_FACILITATOR_URL=https://x402.org/facilitator
PUBLIC_X402_CHARGE_MODE=all
PUBLIC_X402_BOT_SCORE_THRESHOLD=30
```

`PUBLIC_X402_CHARGE_MODE` accepts `all` or `bot-only`. The x402 widget only
publishes metadata; it does not enforce HTTP 402 payment.

## Optional x402 Gateway

Polyglow's default build remains static and works on ordinary static hosting.
Real x402 enforcement needs a runtime adapter that can return
`402 Payment Required` before serving static assets.

The repository includes an optional Cloudflare Workers adapter at
`src/x402/cloudflare-worker.ts`. It is disabled by default:

```bash
X402_ENABLED=false
```

To enable it on Cloudflare Workers Static Assets, set runtime variables in
Wrangler or the Cloudflare dashboard:

```bash
X402_ENABLED=true
X402_PAY_TO=YourWalletAddress
X402_NETWORK=solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1
X402_PRICE=$0.01
X402_FACILITATOR_URL=https://x402.org/facilitator
X402_BOT_ONLY=true
X402_BOT_SCORE_THRESHOLD=30
```

`/api`, `/api/v1`, and localized post routes are routed through the adapter on
Cloudflare. The API probe routes always require payment when the gateway is
enabled; post routes charge bots when `X402_BOT_ONLY=true`. Platforms without a
runtime adapter can still publish the static site and optional x402 metadata,
but they cannot enforce payment.

## Design

`DESIGN.md` records the current visual tokens and UI rules. The live runtime
theme is implemented in `src/styles/global.css`.

## Search and SEO

Pagefind is generated at build time by `src/integrations/pagefind.ts`. The
current index covers localized about pages and post detail pages.

`src/layouts/main.astro` uses `astro-seo` for standard SEO metadata and keeps
project-owned JSON-LD generation in `src/utils/structured-data.ts`. `x-default`
points to the English default locale.

## Deploy

The build output is `dist`.

```bash
pnpm build
```

Polyglow can be published to any static host, including Cloudflare Pages,
Vercel, Netlify, GitHub Pages, or a plain web server. The repository also
includes optional Workers Static Assets deployment:

```bash
pnpm deploy
```

## Feedback

Questions, ideas, and bug reports go to
[GitHub Issues](https://github.com/realriplab/Polyglow/issues).
