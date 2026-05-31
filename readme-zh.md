# Polyglow 中文说明

[English README](README.md)

Polyglow 是一个基于 Astro 6 的多语言静态内容主题。项目内置语言前缀路由、内容集合、分类和标签归档、作者页、Pagefind 搜索、RSS、站点地图、基于 `astro-seo` 的 SEO 元数据、JSON-LD、Astro 图片优化、明暗主题、Astro 视图过渡，以及可选的 Cloudflare Workers Static Assets 部署。

普通静态托管不需要数据库、私有服务、统计账号、广告账号、钱包或 Cloudflare 凭据。

## 环境要求

- Node.js 22 或更新版本
- pnpm

## 开始

```bash
pnpm install
pnpm dev
```

Astro 会输出本地访问地址。根入口跳转到英文默认语言：

```text
http://localhost:4321/en/
```

## 常用命令

```bash
pnpm dev      # 本地开发
pnpm build    # 运行 astro check 并构建静态产物
pnpm preview  # 本地预览构建产物
pnpm deploy   # 构建后通过 Wrangler 部署 dist
```

## 项目结构

```text
astro.config.mjs             # Astro、i18n、图片、sitemap 和集成配置
src/config/                  # 站点、语言、分类标签、分页和资源配置
src/content/                 # 作者、页面和文章内容
src/pages/                   # 多语言路由和生成端点
src/layouts/main.astro       # 共享页面壳、SEO、组件、页头和页脚
src/components/              # 卡片、布局、导航、搜索、组件和图标
src/integrations/pagefind.ts # Pagefind 构建和开发集成
src/styles/global.css        # 运行时 Tailwind v4 主题和组件 CSS
src/styles/design-theme.css  # 从 DESIGN.md 生成的令牌参考
```

## 路由和语言

已配置语言：

```text
en zh fr es ru ja ko pt de id ar
```

`en` 是默认语言。公开页面使用语言前缀，并保留结尾斜杠：

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

中文内容继续保留在 `/zh/`。阿拉伯语页面通过语言元数据启用 RTL 方向。

## 写内容

内容位于 `src/content`：

```text
src/content/
  authors/<locale>/
  pages/<locale>/
  posts/<locale>/
```

文章示例：

```text
src/content/posts/en/my-post.mdx
src/content/posts/zh/my-post.mdx
```

文章 frontmatter：

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

可选 SEO 字段：

```yaml
seoTitle: "Custom title"
seoDescription: "Custom meta description."
canonical: "https://example.com/original/"
heroBlurDataURL: "data:image/..."
```

远程 `heroImage` 需要同时填写 `heroImageWidth` 和 `heroImageHeight`。远程图片域名限制为 Unsplash 和可选的 `PUBLIC_ASSET_BASE_URL` 域名。

## 配置

多数用户只需要修改 `src/config/site.ts`：

```text
src/config/site.ts       # 站点名、域名、描述、仓库、社交链接、首页、资源、统计、广告、x402
src/config/locales.ts    # 语言列表、默认语言、hreflang、文字方向
src/config/taxonomy.ts   # 分类、标签、多语言名称、slug 工具
src/config/pagination.ts # 分页数量
src/config/assets.ts     # 远程图片域名检查和 URL 工具
src/i18n/*.json          # 界面文案
```

环境变量是可选的部署覆盖项，适合不同环境使用不同域名或第三方服务：

```bash
PUBLIC_SITE_URL=https://example.com
PUBLIC_ASSET_BASE_URL=https://assets.example.com
```

可选集成默认关闭：

```bash
PUBLIC_GTM_ENABLED=true
PUBLIC_GTM_ID=GTM-XXXXXXX

PUBLIC_ADSENSE_ENABLED=true
PUBLIC_ADSENSE_CLIENT_ID=ca-pub-0000000000000000

PUBLIC_X402_ENABLED=true
PUBLIC_X402_PAY_TO=YourWalletAddress
PUBLIC_X402_NETWORK=solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp
PUBLIC_X402_PRICE=$0.01
PUBLIC_X402_DESCRIPTION=Voluntary x402 payment support for Polyglow content.
PUBLIC_X402_FACILITATOR_URL=https://your-solana-mainnet-facilitator.example
PUBLIC_X402_CHARGE_MODE=all
PUBLIC_X402_BOT_SCORE_THRESHOLD=30
```

`PUBLIC_X402_CHARGE_MODE` 支持 `all` 和 `bot-only`。x402 组件只发布元数据，不执行 HTTP 402 支付拦截。

## 设计

`DESIGN.md` 记录当前视觉令牌和 UI 规则。实际运行时主题在 `src/styles/global.css` 中实现。

## 搜索和 SEO

Pagefind 由 `src/integrations/pagefind.ts` 在构建阶段生成。当前索引范围包含各语言 about 页面和文章详情页。

`src/layouts/main.astro` 使用 `astro-seo` 输出标准 SEO 元数据，项目自有 JSON-LD 生成保留在 `src/utils/structured-data.ts`。`x-default` 指向英文默认语言。

## 部署

构建产物位于 `dist`。

```bash
pnpm build
```

Polyglow 可以发布到任意静态托管平台，包括 Cloudflare Pages、Vercel、Netlify、GitHub Pages 或普通 Web 服务器。项目还保留了可选的 Workers Static Assets 部署方式：

```bash
pnpm deploy
```

## 反馈

疑问、建议和 bug 反馈请提交到 [GitHub Issues](https://github.com/realriplab/Polyglow/issues)。

## 许可证

MIT。详见 [LICENSE](LICENSE)。
