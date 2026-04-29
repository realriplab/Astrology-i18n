<div align="center">

# Polyglow

### The Astro theme for multilingual publishing that looks polished on day one

[![Astro](https://img.shields.io/badge/Astro-6-BC52EE?logo=astro)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node](https://img.shields.io/badge/Node-%E2%89%A5%2020-339933?logo=node.js)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live_Demo-polyglow.idimi.com-0f172a)](https://idimi.com)

**Polyglow** is a multilingual Astro theme for founders, writers, publishers, and teams who want one content site to serve multiple markets without maintaining multiple codebases.

It gives you locale-aware routing, typed content collections, built-in SEO, fast search, RSS, responsive images, and an editorial reading experience that already feels production-ready.

[View live demo](https://idimi.com) · [Get started](#quick-start) · [See why it converts](#why-teams-pick-polyglow)

<img src="./public/screenshot.webp" alt="Polyglow theme preview" width="100%" />

</div>

## Why teams pick Polyglow

Most blog starters help you publish content. Very few help you publish it well across languages.

Polyglow is designed for content sites that need to feel credible, load fast, and scale internationally without turning localization into a maintenance problem.

- **One theme, multiple markets**: ship a single site with language-prefixed routes and centralized translation dictionaries.
- **Editorial by default**: layouts are tuned for long-form reading, strong hierarchy, tags, categories, author pages, and featured content.
- **SEO already handled**: canonical URLs, Open Graph metadata, JSON-LD, sitemap, and RSS are built in.
- **Performance without the usual tradeoffs**: Astro static output, responsive images, minimal client-side JavaScript, prefetching, and Pagefind search keep pages fast.
- **Production-friendly stack**: Astro 6, Tailwind CSS 4, MDX, Partytown, and Cloudflare-ready deployment.
- **Typed content workflow**: posts, pages, and authors all use schema-validated collections, so content scales without chaos.
- **Thoughtful real-world details**: theme switching, language switching, related posts, latest posts, author pages, and localized search are already wired up.

## Built for

- SaaS teams running multilingual content marketing
- Indie hackers launching a global content site
- Editorial teams publishing in multiple regions
- Personal brands that need a premium blog without a custom build
- Agencies that want a strong Astro starter for content-heavy client work

## What you get

### Publishing experience

- Locale-aware routes under `src/pages/[lang]/`
- Locale-prefixed routing with Astro's built-in i18n handling
- Posts, pages, and author profiles powered by Astro Content Collections
- MDX authoring with typed frontmatter validation
- Category, tag, author, pagination, RSS, search, and localized 404 pages included
- Related posts and latest posts widgets included out of the box

### Growth and discoverability

- Search powered by Pagefind
- Sitemap generation with locale mappings
- RSS feeds for the default locale and localized routes
- Canonical URLs, language alternates, Open Graph, Twitter cards, and JSON-LD metadata
- Article metadata can automatically pick up `lastModified` from Git history

### Performance and UX

- Static output for lean hosting and fast delivery
- Responsive image handling for local and remote sources with `astro:assets`
- AVIF output, priority loading controls, and remote image size inference support
- Minimal JavaScript footprint with Astro-first rendering
- Astro View Transitions support with a reusable page-init/cleanup system
- Theme switching, language switching, and mobile navigation included

## Implementation details that matter

- `astro-seo` is configured with canonical URLs, per-locale alternates, `x-default`, Open Graph, Twitter cards, and JSON-LD for both pages and articles.
- Posts can surface `lastModified` automatically through a remark plugin that reads Git history and falls back to filesystem timestamps when needed.
- The image layer wraps `astro:assets` so the same component can handle optimized local images and remote images without changing authoring ergonomics.
- Astro View Transitions are enabled, and interactive UI components re-initialize cleanly through a shared page lifecycle utility.
- The author page includes structured `Person` data and an optional GitHub activity calendar backed by the GitHub GraphQL API.
- The 404 experience is localized and can adapt links and copy based on the current path or browser language.

## Feature snapshot

| Area                   | Included                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------- |
| Internationalization   | 10 locales: `zh`, `en`, `fr`, `es`, `ru`, `ja`, `ko`, `pt`, `de`, `id`                |
| Routing behavior       | Default locale prefixing with Astro's built-in i18n routing                           |
| Content modeling       | Typed collections for posts, pages, and authors                                       |
| Taxonomy and discovery | Categories, tags, pagination, related posts, latest posts, search                     |
| SEO                    | Canonical URLs, language alternates, Open Graph, Twitter cards, JSON-LD, sitemap, RSS |
| Metadata freshness     | Automatic `lastModified` from Git history with filesystem fallback                    |
| Search                 | Pagefind                                                                              |
| Images                 | `astro:assets` wrapper for optimized local and remote images                          |
| UX                     | Theme switcher, language switcher, mobile nav, localized 404, View Transitions        |
| Styling                | Tailwind CSS 4                                                                        |
| Authoring              | Markdown + MDX                                                                        |
| Author pages           | Bio, socials, latest posts, optional GitHub activity calendar                         |
| Analytics support      | Partytown-ready analytics integration                                                 |
| Deployment             | Static output with Wrangler deployment script                                         |

## Quick Start

### Requirements

- Node.js 20+
- pnpm

### Install

```bash
git clone https://github.com/idimilabs/Polyglow.git
cd Polyglow
pnpm install
```

### Develop

```bash
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321).

### Build

```bash
pnpm build
pnpm preview
```

### Deploy

```bash
pnpm deploy
```

The site is configured for static output and includes a Wrangler-based deploy script.

## Project Structure

```text
.
├── public/                 # Static assets and social images
├── src/
│   ├── assets/             # Optimized local images and media
│   ├── components/         # Reusable UI and feature components
│   ├── content/            # Posts, pages, and author content
│   ├── i18n/               # Translation dictionaries
│   ├── layouts/            # Page layouts
│   ├── pages/              # Routes, including multilingual pages
│   ├── styles/             # Global styles
│   ├── utils/              # Shared helpers
│   └── content.config.ts   # Content schemas
├── astro.config.mjs        # Astro configuration
└── package.json            # Scripts and dependencies
```

## How multilingual support works

Polyglow ships with 10 locales out of the box, with `en` as the default language.

- Translation dictionaries live in `src/i18n/`
- Language-aware routes live in `src/pages/[lang]/`
- Locale definitions are managed in `src/utils/i18n.ts`
- Collection schemas validate locale usage in `src/content.config.ts`
- Built-in Astro i18n routing handles locale-prefixed URLs for every supported language

### Add a new locale

1. Add the locale code in `src/utils/i18n.ts`.
2. Add the same locale to `src/content.config.ts`.
3. Create a dictionary file in `src/i18n/<lang>.json`.
4. Add any required localized content under `src/content/`.
5. Update locale mappings in `astro.config.mjs` if needed.

## Content authoring

Posts live in `src/content/posts/[lang]/`. Pages and author profiles follow the same collection-based structure.

Example frontmatter:

```yaml
---
title: "The Art of Star Gazing"
description: "A guide to observing the night sky."
category: "Astronomy"
tags: ["Stars", "Night"]
pubDate: 2024-03-21
author: "Astro Learner"
heroImage: "https://images.unsplash.com/photo-example"
heroImageAlt: "Stars over a mountain range"
locales: en
featured: true
---
```

## Customization

### Branding

- Update site-level metadata and integrations in `astro.config.mjs`
- Replace the logo and social assets in `src/assets/` and `public/`
- Adjust navigation, footer, and layout components under `src/components/ui/`

### Analytics

Partytown is already set up for performance-friendly analytics loading. If you use GTM or another analytics provider, start with the files in `src/components/analytics/`.

### GitHub activity widget

The author page can display GitHub activity when `GITHUB_TOKEN` is available.

```env
GITHUB_TOKEN=your_personal_access_token
```

Without the token, the site still works and falls back gracefully.

## Why this README is honest

Polyglow is not trying to be a general-purpose app starter. It is optimized for content-first sites that need multilingual publishing, strong SEO foundations, and a premium reading experience.

If your primary use case is a marketing site, documentation portal, or editorial publication with multiple locales, this theme is a strong starting point. If you need a dashboard-heavy product UI, you should start elsewhere.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run `pnpm check`.
5. Open a pull request.

## License

MIT. See [LICENSE](LICENSE).

<div align="center">
  Built by <a href="https://idimi.com">iDiMi</a>
</div>
