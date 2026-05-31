# Polyglow Agent Guide

## Purpose

This file tells coding agents how to work in this repository. Keep engineering
workflow, commands, repository structure, deployment, and contribution rules
here. Keep visual tokens and UI appearance rules in `DESIGN.md`.

Polyglow is an Astro 6 static multilingual editorial theme. The current default
locale is English, public routes keep locale prefixes, and `/` redirects to
`/en/`. The repository must remain usable without private services, databases,
Cloudflare credentials, analytics IDs, ad IDs, payment credentials, or wallet
addresses.

## Stack

- Astro 6 with `output: "static"` and `trailingSlash: "always"`.
- Tailwind CSS v4 through `@tailwindcss/vite` and CSS-first runtime tokens.
- MDX content collections backed by `astro:content` glob loaders.
- `astro-expressive-code` for code blocks.
- Custom Pagefind integration in `src/integrations/pagefind.ts`.
- `astro-icon` with a Lucide allowlist configured in `astro.config.mjs`.
- `astro-seo` for standard SEO metadata.
- Astro `ClientRouter` for view transitions.
- `@astrojs/partytown` for optional Google Tag Manager.
- Optional Google AdSense through `src/components/widgets/Adsense.astro`.
- Optional x402 metadata through `src/components/widgets/X402.astro`.
- Astro image optimization through `OptimizedPicture.astro`.
- Optional Cloudflare Workers Static Assets deployment.

## Required Commands

- Install dependencies: `pnpm install`
- Start development server: `pnpm dev`
- Typecheck and build: `pnpm build`
- Preview built site: `pnpm preview`
- Deploy prebuilt static assets to Cloudflare Workers: `pnpm deploy`

Use pnpm for Node.js work. Do not add npm, yarn, or bun lockfiles.

## Repository Map

- `astro.config.mjs`: Astro static output, i18n, image domains, integrations,
  sitemap, Tailwind, Pagefind, and Lucide icon allowlist.
- `src/pages/`: localized routes, post/category/tag pagination, author, search,
  RSS, robots, and llms endpoints.
- `src/layouts/main.astro`: shared HTML shell, `astro-seo`, JSON-LD,
  ClientRouter, header/footer, GTM, and AdSense widgets.
- `src/components/`: cards, layout, navigation, search, islands, widgets, icons,
  and image helpers.
- `src/content/`: localized authors, pages, and posts.
- `src/content.config.ts`: content collection schemas and remote hero image
  validation.
- `src/config/`: site, locale, taxonomy, pagination, and asset configuration.
- `src/i18n/*.json`: visible UI strings for every supported locale.
- `src/integrations/pagefind.ts`: build-time Pagefind indexing and dev server
  serving for `/pagefind/`.
- `src/styles/global.css`: live Tailwind v4 runtime theme, prose, cards,
  archive, taxonomy, search, and responsive UI CSS.
- `src/styles/design-theme.css`: generated Tailwind v4 token reference from
  `DESIGN.md`; do not edit by hand unless the token export workflow changes.
- `DESIGN.md`: visual design source for tokens and UI appearance.

## Architecture Rules

- Keep the primary site static-first. A plain `pnpm build` must produce a usable
  static site in `dist`.
- Preserve locale-prefixed routes. The default locale is `en`, and `/`
  redirects to `/en/`.
- Preserve Astro `trailingSlash: "always"` behavior.
- Preserve RTL support for Arabic routes.
- Do not make Cloudflare mandatory. The Cloudflare path uploads static assets
  from `dist`; ordinary static hosting must continue to work.
- Do not add database-backed features by default.
- Treat `src/config/site.ts` as the main user configuration file. Public
  environment variables are optional deployment overrides.
- Keep translated UI strings in `src/i18n/*.json`; avoid single-language
  hard-coded visible UI text.
- Keep Google Tag Manager, Google AdSense, and x402 optional.
- Keep `src/components/widgets/X402.astro` available as opt-in metadata. Do not
  add HTTP 402 enforcement or Cloudflare-only middleware unless explicitly
  requested.
- Pagefind indexes generated static HTML through `src/integrations/pagefind.ts`.
  Preserve the current searchable surface unless the task explicitly changes
  search scope.
- Keep generated surfaces static: RSS, sitemap, robots, llms text files,
  Pagefind output, and Markdown-derived pages must not depend on runtime
  services.

## Content Rules

- Posts live in `src/content/posts/<locale>/`.
- Pages live in `src/content/pages/<locale>/`.
- Authors live in `src/content/authors/<locale>/`.
- Supported locales are `en zh fr es ru ja ko pt de id ar`.
- Use stable slugs and complete frontmatter.
- Post frontmatter uses `authors: ["default"]`, `locale`, `category`, `tags`,
  `heroImage`, and `heroImageAlt`.
- Remote `heroImage` values must include `heroImageWidth` and
  `heroImageHeight`.
- Remote images are limited to the configured asset host and Unsplash hosts.
- Remote `OptimizedPicture` usage in content must include explicit `width` and
  `height` unless it intentionally uses Astro `inferSize`.
- Keep category and tag slugs canonical through `src/config/taxonomy.ts`.

## UI and Design Workflow

- Read `DESIGN.md` before changing colors, typography, spacing, radii, cards,
  navigation, article prose, search styling, or component appearance.
- Keep the live runtime theme in `src/styles/global.css` unless the task is
  specifically to wire generated design tokens into runtime CSS.
- Use the existing `Icon` component and configured Lucide icon allowlist. Add
  new icons to `astro.config.mjs` before use.
- Keep layouts responsive across mobile, tablet, and desktop.
- Preserve the existing image-led card language, compact archive rows, readable
  article pages, and Pagefind search styling.
- Scripts that initialize page UI must work with Astro ClientRouter. Use
  `astro:page-load` for initialization and clean up listeners on
  `astro:before-swap` where needed.

## Open-Source Contribution Rules

- Keep defaults safe for forked projects and first-time users.
- Do not commit tokens, local credentials, private database IDs, analytics IDs,
  wallet addresses, or production secrets.
- Document new public environment variables in `.env.example`, `README.md`, and
  `readme-zh.md`.
- Prefer small, focused changes with clear deployment impact.
- Do not leave generated output stale when its source file changes in the same
  task.
- Preserve the MIT license and package metadata unless explicitly asked.

## Pull Request Guidance

- Summarize user-facing behavior and deployment implications.
- Include verification commands that were run.
- For dependency updates, merge only after conflicts are resolved and checks
  pass.
- For Cloudflare changes, state whether ordinary static hosting is affected.
