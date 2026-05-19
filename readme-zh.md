# Polyglow 中文说明

[English README](README.md)

Polyglow 是一个面向多语言写作的 Astro 静态博客主题。

主题内置多语言路由、内容集合、分类、标签、作者页、搜索、RSS、站点地图、SEO 元数据、图片优化、明暗主题和静态部署输出。

## 开始

环境要求：

- Node.js 24 或更新版本
- pnpm 11

```bash
pnpm install
pnpm dev
```

Astro 会输出本地访问地址，通常是：

```text
http://localhost:4321/en/
```

## 常用命令

```bash
pnpm dev        # 本地开发
pnpm build      # 构建静态站点
pnpm preview    # 本地预览构建结果
pnpm deploy     # 使用 Wrangler 构建并部署到 Cloudflare
```

## 写内容

内容位于 `src/content`：

```text
src/content/
  authors/
  pages/
  posts/
```

文章按语言目录存放：

```text
src/content/posts/en/my-post.mdx
src/content/posts/zh/my-post.mdx
```

文章 frontmatter：

```yaml
---
title: "文章标题"
description: "用于卡片和 SEO 的简短摘要。"
category: "build"
tags: ["strategy"]
pubDate: 2026-05-12
updatedDate: 2026-05-12
authors: ["default"]
heroImage: "/open-graph.webp"
heroImageAlt: "图片替代文本"
locale: "zh"
slug: "my-post"
draft: false
featured: false
---
```

远程 `heroImage` 需要同时填写 `heroImageWidth` 和 `heroImageHeight`。

## 配置

常用文件：

```text
AGENTS.md                # 编码代理说明
DESIGN.md                # 设计令牌和视觉识别说明
src/config/site.ts       # 站点名、域名、仓库、首页布局
src/config/locales.ts    # 语言和文字方向
src/config/taxonomy.ts   # 分类和标签
src/i18n/*.json          # 界面文案
```

设计令牌流程：

```bash
pnpm design:lint     # 校验 DESIGN.md
pnpm design:theme    # 生成 Tailwind v4 @theme CSS
```

生成的 Tailwind v4 theme 写入 `src/styles/design-theme.css`。当前运行时主题仍由
`src/styles/global.css` 通过 CSS 变量完成明暗主题切换。

已配置语言：

```text
zh en fr es ru ja ko pt de id ar
```

`src/config/site.ts` 中的首页布局：

- `cover`：图片封面首页。
- `archive`：紧凑归档首页。
- `text`：文字卡片首页，适合少图内容。

## 部署

构建结果位于 `dist`。

```bash
pnpm build
```

Polyglow 可以发布到任意静态托管平台，包括 Cloudflare Pages、Vercel、
Netlify、GitHub Pages 或普通 Web 服务器。项目不需要数据库，也不需要服务端函数。

项目也保留了可选的 Cloudflare Workers 部署方式：

```bash
pnpm deploy
```

### Google Tag Manager

Google Tag Manager 支持默认关闭。开启后，GTM 脚本通过 Partytown 加载，把分析脚本工作移到
worker 线程。

通过公开环境变量配置：

```bash
PUBLIC_GTM_ENABLED=true
PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Google AdSense

Google AdSense 支持默认关闭。开启后，站点会在共享布局中加载官方 async AdSense 脚本。

通过公开环境变量配置：

```bash
PUBLIC_ADSENSE_ENABLED=true
PUBLIC_ADSENSE_CLIENT_ID=ca-pub-0000000000000000
```

## 反馈

疑问、建议和 bug 反馈请提交到 [GitHub Issues](https://github.com/realriplab/Polyglow/issues)。

## 许可证

MIT。详见 [LICENSE](LICENSE)。
