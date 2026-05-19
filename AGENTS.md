# Polyglow Agent Guide

## Purpose

This file tells coding agents how to work in this repository. Keep engineering
workflow, commands, repository structure, testing, deployment, and contribution
rules here. Keep visual design tokens and UI appearance rules in `DESIGN.md`.

Polyglow is a multilingual Astro static blog theme. The repository is intended
to be useful as an open-source project: default setup must work without private
services, Cloudflare, or production credentials.

## Stack

- Astro 6 static output.
- Tailwind CSS v4 through the Vite plugin and CSS-first theme configuration.
- MDX content collections.
- Pagefind search generated at build time.
- `astro-icon` with the configured Lucide icon allowlist.
- `@astrojs/partytown` for optional Google Tag Manager scripts.
- Optional Google AdSense script support.
- Optional x402 payment metadata widget.
- Optional Cloudflare Workers Static Assets deployment.
- Vitest for unit tests.

## Required Commands

- Install dependencies: `pnpm install`
- Start development server: `pnpm dev`
- Run tests: `pnpm test`
- Typecheck and build: `pnpm build`
- Preview built site: `pnpm preview`
- Validate design tokens: `pnpm design:lint`
- Generate Tailwind v4 design theme: `pnpm design:theme`
- Validate Cloudflare packaging after Worker/config changes:
  `pnpm exec wrangler deploy --dry-run`

Use Node.js 24 or newer and pnpm 11. Do not add npm, yarn, or bun lockfiles.

## Repository Map

- `src/pages/`: Astro routes, localized pages, RSS, robots, llms endpoints.
- `src/layouts/main.astro`: shared HTML shell, SEO, header/footer layout.
- `src/components/`: UI components grouped by cards, layout, navigation,
  search, islands, widgets, and icons.
- `src/content/`: authors, pages, and posts.
- `src/content.config.ts`: content collection schemas.
- `src/config/`: site, locale, taxonomy, pagination, and asset configuration.
- `src/i18n/*.json`: interface strings for all supported locales.
- `src/styles/global.css`: live Tailwind v4 runtime theme and component CSS.
- `src/styles/design-theme.css`: generated Tailwind v4 `@theme` export from
  `DESIGN.md`; do not edit by hand.
- `tests/`: unit tests for utilities.
- `DESIGN.md`: visual design source for tokens and UI appearance.

## Architecture Rules

- Keep the primary site static-first. A plain `pnpm build` must produce a usable
  static site in `dist`.
- Do not make Cloudflare mandatory. The Cloudflare path is static assets
  deployment only; do not add database-backed features by default.
- Google Tag Manager must stay optional. Configure it through
  `SITE_CONFIG.analytics.googleTagManager` and public env vars; do not scatter
  tracking IDs through components.
- Google AdSense must stay optional. Configure it through
  `SITE_CONFIG.analytics.googleAdsense` and public env vars; keep publisher IDs
  out of layout files.
- x402 support must stay optional. Configure the static widget through
  `SITE_CONFIG.payments.x402` and public env vars. Keep `X402.astro` unmounted
  from the shared layout unless explicitly requested. Do not add HTTP 402
  enforcement or Cloudflare-only middleware unless explicitly requested.
- Preserve Astro `trailingSlash: "always"` behavior and locale-prefixed routes.
- Preserve RTL support for Arabic routes.
- Keep configuration in `src/config/*`; do not scatter site-wide constants
  through components.
- Keep translated UI strings in `src/i18n/*.json`; avoid hard-coded visible UI
  text in only one language.

## Content Rules

- Posts live in `src/content/posts/<locale>/`.
- Pages live in `src/content/pages/<locale>/`.
- Authors live in `src/content/authors/`.
- Use stable slugs and complete frontmatter.
- Remote `heroImage` values must include `heroImageWidth` and
  `heroImageHeight`.
- RSS, sitemap, robots, llms text files, Pagefind output, and Markdown endpoints
  are generated/static surfaces; do not add page-only UI behavior to them.

## UI and Design Workflow

- Read `DESIGN.md` before changing colors, typography, spacing, radii, card
  treatments, navigation UI, article typography, search styling, or component
  appearance.
- For UI changes, run `pnpm design:lint`. The command must finish with 0 errors.
  Review warnings; fix new contrast warnings introduced by the change.
- When editing `DESIGN.md`, run `pnpm design:theme` and commit the regenerated
  `src/styles/design-theme.css`.
- Keep the live runtime theme in `src/styles/global.css` unless the task is
  specifically to wire generated design tokens into runtime CSS.
- Use the existing `Icon` component and configured icon allowlist. Add new icons
  to `astro.config.mjs` before use.
- Keep layouts responsive across mobile, tablet, and desktop.

## Testing Rules

- Run `pnpm test` after changing utilities, generated-count logic,
  pagination, or test-covered helpers.
- Run `pnpm build` after changing routes, layouts, components, styles, content
  schemas, Astro config, i18n, or design-generated CSS.
- Run `pnpm exec wrangler deploy --dry-run` after changing `wrangler.jsonc`,
  static asset routing, or Cloudflare deployment behavior.
- Do not report completion until the relevant commands have been run and their
  output has been checked.

## Open-Source Contribution Rules

- Keep defaults safe for forked projects and first-time users.
- Do not commit tokens, local credentials, database IDs tied to a private
  account, or production secrets.
- Document any new environment variable in `.env.example` and README files.
- Prefer small, focused changes with clear deployment impact.
- Do not leave generated output stale when the source file is part of the same
  change.
- Preserve the MIT license and package metadata unless explicitly asked.

## Pull Request Guidance

- Summarize user-facing behavior and deployment implications.
- Include the verification commands that were run.
- For dependency updates, merge only after conflicts are resolved and checks
  pass.
- For Cloudflare changes, state whether the change affects ordinary static
  hosting.
