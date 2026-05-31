---
version: "alpha"
name: "Polyglow"
description: "A multilingual editorial Astro theme with neutral surfaces, image-led glass cards, compact archives, dark mode, Astro view transitions, Pagefind search, and long-form typography."
colors:
  background: "#FFFFFF"
  foreground: "#18181B"
  card: "#FFFFFF"
  cardForeground: "#18181B"
  popover: "#FFFFFF"
  popoverForeground: "#18181B"
  primary: "#27272A"
  primaryForeground: "#FAFAFA"
  secondary: "#F4F4F5"
  secondaryForeground: "#27272A"
  muted: "#F4F4F5"
  mutedForeground: "#71717A"
  accent: "#F4F4F5"
  accentForeground: "#27272A"
  destructive: "#DC2626"
  border: "#E4E4E7"
  input: "#E4E4E7"
  ring: "#A1A1AA"
  darkBackground: "#18181B"
  darkForeground: "#FAFAFA"
  darkCard: "#27272A"
  darkPopover: "#27272A"
  darkPrimary: "#E4E4E7"
  darkPrimaryForeground: "#27272A"
  darkSecondary: "#3F3F46"
  darkSecondaryForeground: "#FAFAFA"
  darkMuted: "#3F3F46"
  darkMutedForeground: "#A1A1AA"
  darkAccent: "#3F3F46"
  darkAccentForeground: "#FAFAFA"
  darkBorder: "#FFFFFF"
  darkInput: "#FFFFFF"
  darkRing: "#71717A"
  glassOverlay: "#000000"
  glassOverlayStrong: "#262626"
  glassBorder: "#FFFFFF"
  glassSurfaceLight: "#FFFFFF"
typography:
  sans:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: "0px"
  heading:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: "1.15"
    letterSpacing: "0px"
  heroTitle:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: "1.05"
    letterSpacing: "0px"
  articleBody:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "2rem"
    letterSpacing: "0px"
  nav:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.25"
    letterSpacing: "0px"
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: "1.25"
    letterSpacing: "0.025em"
  small:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1.5"
    letterSpacing: "0px"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  card: "24px"
  hero: "28px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  page-x: "16px"
  page-x-sm: "20px"
  page-x-md: "24px"
  section-y: "40px"
components:
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.sans}"
  page-dark:
    backgroundColor: "{colors.darkBackground}"
    textColor: "{colors.darkForeground}"
    typography: "{typography.sans}"
  post-card:
    backgroundColor: "{colors.glassOverlay}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.card}"
    padding: "{spacing.md}"
  article-hero-panel:
    backgroundColor: "{colors.glassOverlayStrong}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  text-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.cardForeground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  taxonomy-card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  nav-link:
    textColor: "{colors.mutedForeground}"
    typography: "{typography.nav}"
  primary-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.md}"
    padding: "12px"
  secondary-button:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondaryForeground}"
    rounded: "{rounded.md}"
    padding: "12px"
  search-input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md}"
  meta-pill:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm}"
  glass-meta-pill:
    backgroundColor: "{colors.glassOverlayStrong}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm}"
  destructive-button:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.md}"
    padding: "12px"
---

## Overview

Polyglow is a multilingual editorial publishing interface built on Astro static
output. The live visual system is implemented in `src/styles/global.css`; this
file records the same system as tokens and design rules so later UI work keeps
the current theme intact.

The current interface is neutral, content-first, image-led, and compact. It
uses strong real imagery, glass panels over post covers and article heroes,
quiet navigation, dense archive rows, readable prose, Pagefind search styling,
Astro view transitions, and a light/dark theme switcher.

## Theme Model

Runtime theming lives in `src/styles/global.css`. Tailwind v4 token namespaces
map to semantic CSS variables, then `:root` and `.dark` provide the live light
and dark values.

`DESIGN.md` stores sRGB approximations of the current OKLCH runtime tokens.
`src/styles/design-theme.css` is a Tailwind-compatible token reference generated
from this file. The generated file does not replace the runtime dark-mode
variables by itself.

## Color System

The palette is a neutral publishing palette:

- `background` and `foreground` define the main reading surface.
- `card`, `popover`, `secondary`, `muted`, and `accent` support cards,
  dropdowns, hover states, chips, search results, and low-emphasis UI.
- `primary` and `primaryForeground` define high-emphasis actions and inverted
  text.
- `border`, `input`, and `ring` define structure and focus affordances.
- `destructive` is reserved for destructive or error states.
- `glassOverlay`, `glassOverlayStrong`, `glassBorder`, and
  `glassSurfaceLight` support post-card panels, article hero panels, dropdowns,
  and mobile navigation.

Dark mode keeps the same neutral hierarchy with darker surfaces and lighter
text. Use the dark tokens as design references; runtime switching stays in CSS.

## Typography

The project uses a system sans stack throughout. This keeps startup fast,
supports all configured locales, and avoids external font loading.

Article prose uses `1rem` type with `2rem` line height. Chinese, Japanese, and
Korean prose uses justified text where supported. Arabic pages rely on the
document `dir="rtl"` value and start-aligned prose. Headings are compact and
strong. Navigation and metadata stay small, with normal or slight positive
tracking only where the current UI already uses uppercase labels.

Do not use viewport-scaled font sizes. Do not use negative letter spacing.

## Layout

The standard page frame is `max-w-6xl` with responsive horizontal padding.
Most pages use 16px on mobile and 24px on wider screens.

Article prose centers at `max-w-3xl`. Article media stays within the article
content width unless a page template intentionally gives it a wider surface.
Archive, taxonomy, and search pages favor scanning density and compact rows
over promotional composition.

The homepage has three code-supported modes in `SITE_CONFIG.homepage.layout`:
`cover`, `archive`, and `text`. The default implementation currently uses
`cover`.

## Cards and Glass

Post cover cards use full-bleed imagery with a gradient and a glass content
panel. The glass panel uses dark translucent backgrounds, subtle white borders,
blur, and restrained shadow.

Article heroes use the same image-first language, with a centered glass title
panel over the image. Header, dropdown, and mobile navigation share the glass
language, but the fixed header itself uses theme background and border tokens
for legibility.

Text cards and taxonomy cards stay quiet: neutral background, small radius,
thin border, and modest hover movement.

Do not create cards inside cards. Do not turn full page sections into floating
cards.

## Shapes

The base runtime radius is 10px. Small controls use 6px, standard buttons and
dropdown items use 8px, regular cards use 10px to 14px, image cards use 24px to
28px, and metadata chips use fully rounded pills.

## Component Guidance

- **Header and nav:** compact height, theme background, subtle border, grouped
  category dropdowns, search, language switcher, theme switcher, and mobile nav.
- **Post cards:** image-first with readable glass panels and real imagery.
- **Article page:** image hero, compact metadata, centered readable prose, and
  related posts.
- **Archive list:** dense rows, tabular dates, truncated titles where needed,
  and no oversized cards.
- **Taxonomy pages:** compact link grids, pills, and paginated post grids.
- **Search:** Pagefind controls follow background, foreground, border, ring,
  and radius tokens.
- **Widgets:** GTM, AdSense, and x402 remain visually silent unless enabled by
  configuration.
- **Icons:** use `src/components/icons/Icon.astro` and the Lucide allowlist in
  `astro.config.mjs`.

The prose wrapper class is `polyglow-prose`. Treat it as a stable CSS API
unless the rename is part of a deliberate cleanup across components, CSS, and
tests.

## Visual Constraints

- Keep UI text inside its container at mobile, tablet, and desktop sizes.
- Preserve multilingual and RTL layout behavior.
- Preserve real image-led surfaces for post cards and article heroes.
- Avoid decorative background blobs, one-note color palettes, and nested cards.
- Avoid visible UI text that explains implementation details.
