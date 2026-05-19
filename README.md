# Polyglow

[中文说明](readme-zh.md)

Polyglow is a static Astro blog theme for multilingual writing.

It includes locale routes, content collections, categories, tags, author pages, search, RSS, sitemap, SEO metadata, optimized images, light/dark themes, and static deployment output.

## Start

Requirements:

- Node.js 24 or newer
- pnpm 11

```bash
pnpm install
pnpm dev
```

Astro prints the local URL, usually:

```text
http://localhost:4321/en/
```

## Commands

```bash
pnpm dev        # Start local development
pnpm build      # Build the static site
pnpm preview    # Preview the built site locally
pnpm deploy     # Build and deploy to Cloudflare with Wrangler
```

## Write Content

Content lives in `src/content`:

```text
src/content/
  authors/
  pages/
  posts/
```

Posts use locale folders:

```text
src/content/posts/en/my-post.mdx
src/content/posts/zh/my-post.mdx
```

Post frontmatter:

```yaml
---
title: "Post title"
description: "Short summary for cards and metadata."
category: "build"
tags: ["strategy"]
pubDate: 2026-05-12
updatedDate: 2026-05-12
authors: ["default"]
heroImage: "/open-graph.webp"
heroImageAlt: "Descriptive image alternative text"
locale: "en"
slug: "my-post"
draft: false
featured: false
---
```

Remote `heroImage` values must include `heroImageWidth` and `heroImageHeight`.

## Configure

Common files:

```text
AGENTS.md                # Coding agent instructions
DESIGN.md                # Design tokens and visual identity notes
src/config/site.ts       # Site name, URL, repository, homepage layout
src/config/locales.ts    # Locales and text direction
src/config/taxonomy.ts   # Categories and tags
src/i18n/*.json          # Interface text
```

Design token workflow:

```bash
pnpm design:lint     # Validate DESIGN.md
pnpm design:theme    # Generate Tailwind v4 @theme CSS
```

The generated Tailwind v4 theme is written to
`src/styles/design-theme.css`. The live runtime theme in
`src/styles/global.css` still uses CSS variable indirection for dark mode.

Configured locales:

```text
zh en fr es ru ja ko pt de id ar
```

Homepage layouts in `src/config/site.ts`:

- `cover`: image-led homepage.
- `archive`: compact archive-first homepage.
- `text`: text-card homepage for low-image publishing.

## Deploy

The build output is `dist`.

```bash
pnpm build
```

Polyglow can be published to any static host, including Cloudflare Pages, Vercel,
Netlify, GitHub Pages, or a plain web server. It does not require a database or
serverless function.

Polyglow also includes an optional Cloudflare Workers deployment path:

```bash
pnpm deploy
```

### Google Tag Manager

Google Tag Manager support is optional and disabled by default. When enabled,
the GTM script is loaded through Partytown so analytics work is moved off the
main thread.

Configure it with public environment variables:

```bash
PUBLIC_GTM_ENABLED=true
PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Google AdSense

Google AdSense support is optional and disabled by default. When enabled, the
site loads the official async AdSense script from the shared layout.

Configure it with public environment variables:

```bash
PUBLIC_ADSENSE_ENABLED=true
PUBLIC_ADSENSE_CLIENT_ID=ca-pub-0000000000000000
```

## Feedback

Questions, ideas, and bug reports go to [GitHub Issues](https://github.com/realriplab/Polyglow/issues).

## License

MIT. See [LICENSE](LICENSE).
