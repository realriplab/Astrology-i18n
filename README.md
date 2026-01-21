<div align="center">

# Astrology i18n — Multilingual Astro Blog Theme

[![Astro](https://img.shields.io/badge/Astro-5-BC52EE?logo=astro)](https://astro.build) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com) [![Node](https://img.shields.io/badge/Node-%E2%89%A5%2020-339933?logo=node.js)](https://nodejs.org) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A professional, multilingual photo-and-prose theme built with **Astro 5** and **Tailwind CSS 4**. Start your global storytelling journey with per-locale routes, centralized dictionaries, SEO optimization, and a modern, responsive design.

<a href="https://pagespeed.web.dev/analysis/https-astrology-yo7bu6q1-edgeone-app/nij513nbyr?form_factor=mobile">
  <img src="public/astrology-i18n-lighthouse-score.svg" alt="Lighthouse Score" width="300" />
</a>

</div>

## Table of Contents

- [Highlights](#-highlights)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Internationalization (i18n)](#-internationalization-i18n)
- [Content Authoring](#-content-authoring)
- [Configuration & Integrations](#-configuration--integrations)
- [Contributing](#-contributing)
- [License](#-license)

## ⚡️ Highlights

- **Deep Internationalization (i18n)**: Native support for language-prefixed routes (`/[lang]/`), centralized JSON dictionaries, and automatic fallback handling.
- **Content Collections**: Type-safe frontmatter for Posts, Pages, and Authors.
- **Performance First**: High Lighthouse scores with optimized assets, link prefetching, and minimal client-side JS.
- **Astro 5 & Tailwind 4**: Built on the latest, cutting-edge stack for maximum developer experience.
- **SEO Optimized**: Built-in canonical URLs, Open Graph tags, JSON-LD, sitemaps, and RSS feeds per locale.
- **Full-Text Search**: Fast, client-side search powered by `astro-pagefind`.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.0.0 or higher
- **pnpm**: Recommended package manager

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/idimilabs/Astrology-i18n.git
    cd Astrology-i18n
    ```

2.  Install dependencies:

    ```bash
    pnpm install
    ```

3.  Start the development server:
    ```bash
    pnpm run dev
    ```
    Open [http://localhost:4321](http://localhost:4321) to view it in the browser.

### Build for Production

To build your site for production deployment:

```bash
pnpm run build
```

To preview the production build locally:

```bash
pnpm run preview
```

## 📂 Project Structure

A quick look at the top-level files and directories you'll work with:

```text
.
├── public/                 # Static assets (images, fonts, etc.)
├── src/
│   ├── assets/             # Optimized assets (images processed by Astro)
│   ├── components/         # Reusable UI components
│   ├── content/            # Markdown/MDX content (posts, pages, authors)
│   ├── i18n/               # Translation dictionaries (en.json, zh.json, etc.)
│   ├── layouts/            # Page layouts
│   ├── pages/              # Astro pages and routes
│   │   └── [lang]/         # Dynamic locale routes
│   ├── styles/             # Global styles (CSS variables, resets)
│   ├── utils/              # Helper functions (i18n, formatting)
│   └── content.config.ts   # Content collections definition
└── astro.config.mjs        # Astro configuration
```

## 🌍 Internationalization (i18n)

**Astrology i18n** comes with pre-configured support for 10 languages:
`zh` (Default), `en`, `fr`, `es`, `ru`, `ja`, `ko`, `pt`, `de`, `id`.

### Adding a New Language

1.  **Update Config**: Add the language code to `src/utils/i18n.ts` and `src/content.config.ts`.
2.  **Add Dictionary**: Create a new `<lang>.json` file in `src/i18n/`.
3.  **Astro Config**: Update `astro.config.mjs` `i18n` settings if necessary.

### Fallback Strategy

The theme uses a rewrite configuration. If a page doesn't exist in the requested language, it can be configured to serve content from the default language while maintaining the URL, or redirect.

## ✍️ Content Authoring

Content lives in `src/content/posts/[lang]/`. Create a standard Markdown or MDX file:

```yaml
---
title: "The Art of Star Gazing"
description: "A guide to observing the night sky."
pubDate: 2024-03-21
category: "Astronomy"
tags: ["Stars", "Night"]
author: "Astro Learner"
heroImage: "../assets/stars.jpg"
locales: "en" # helper for filtering
---
```

## 🛠 Configuration & Integrations

### GitHub Activity Calendar

To display the contribution graph on the Author page:

1.  **Local Dev**: Create a `.env` file:
    ```env
    GITHUB_TOKEN=your_personal_access_token
    ```
2.  **Production**: Add `GITHUB_TOKEN` to your deployment platform's environment variables.

### Analytics

The theme includes **Partytown** integration for performance-friendly analytics. Configure your GTM or analytics IDs in `src/components/analytics`.

### Search

Search is powered by **Pagefind**. The index is built automatically when you run `pnpm run build`.

### Code Styling

The project uses **Prettier** for code formatting, configured via `.prettierrc`.

To format the codebase:

```bash
pnpm run format
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/) (`git commit -m 'feat: Add some AmazingFeature'`).
4.  Push to the branch.
5.  Open a Pull Request.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://idimi.com">iDiMi</a></p>
</div>
