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
src/i18n/*.json          # 界面语言文案
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
PUBLIC_X402_NETWORK=solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1
PUBLIC_X402_PRICE=$0.08
PUBLIC_X402_DESCRIPTION=Voluntary x402 payment support for Polyglow content.
PUBLIC_X402_FACILITATOR_URL=https://x402.org/facilitator
PUBLIC_X402_CHARGE_MODE=all
PUBLIC_X402_BOT_SCORE_THRESHOLD=30
```

`PUBLIC_X402_CHARGE_MODE` 支持 `all` 和 `bot-only`。x402 组件只发布元数据，不执行 HTTP 402 支付拦截。

## 可选 x402 网关

Polyglow 默认构建仍是静态站，普通静态托管照常可用。真正执行 x402 收费需要运行时适配器，在返回静态资源之前先返回 `402 Payment Required`。

仓库内置了可选的 Cloudflare Workers 适配器：

```text
src/x402/cloudflare-worker.ts
```

默认关闭：

```bash
X402_ENABLED=false
```

在 Cloudflare Workers Static Assets 上启用时，在 Wrangler 或 Cloudflare 后台设置运行时变量：

```bash
X402_ENABLED=true
X402_PAY_TO=YourWalletAddress
X402_NETWORK=solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1
X402_PRICE=$0.08
X402_FACILITATOR_URL=https://x402.org/facilitator
X402_BOT_ONLY=true
X402_BOT_SCORE_THRESHOLD=30
```

`X402_PAY_TO` 设为运行时 Secret，其他值设为运行时变量。`x402.org`
facilitator 当前公布的 Solana 支持网络是
`solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`。更换 facilitator 时，
`X402_NETWORK` 必须使用该 facilitator 的 `/supported` 接口返回的网络值。

Cloudflare 部署时，`/api`、`/api/v1` 和各语言文章页会进入适配器。启用网关后，API 探测路由始终要求支付；文章页在 `X402_BOT_ONLY=true` 时只对 bot 收费。不支持运行时适配器的平台仍可发布静态站和可选 x402 元数据，但不能执行支付拦截。

生产部署验证命令：

```bash
curl -i https://your-domain.example/api
curl -i https://your-domain.example/api/v1
```

网关启用后，两条请求都返回 `402 Payment Required`，并带有
`payment-required` 响应头。Polyglow 生产环境已在
`https://polyglow.realrip.com/api` 和
`https://polyglow.realrip.com/api/v1` 验证通过。

## Agent API 发现

Polyglow 发布静态 API 发现文件，供代理自动读取：

- `/.well-known/api-catalog` 发布 RFC 9727 API Catalog，包含 `/api` 和
  `/api/v1` 的 linkset 条目。
- `/openapi.json` 描述受 x402 保护的 API 探测端点。
- `/auth.md` 说明代理访问方式和 x402 支付流程。

项目默认不发布 OAuth/OIDC 元数据，因为仓库不包含 OAuth 授权服务器。只有部署环境具备真实的 issuer、token endpoint、JWKS endpoint、scope 和注册策略时，才添加 `/.well-known/openid-configuration`、`/.well-known/oauth-authorization-server` 或 `/.well-known/oauth-protected-resource`。

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
