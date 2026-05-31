import { DEFAULT_LOCALE, LOCALE_META, LOCALES } from "@/config/locales"
import { SITE_CONFIG } from "@/config/site"
import { getCategory, getTag } from "@/config/taxonomy"
import {
  postCategorySlug,
  postTagSlugs,
  postUrl,
  type PostEntry,
} from "@/utils/posts"

function canonicalPostUrl(post: PostEntry): string {
  return `${SITE_CONFIG.url}${postUrl(post)}`
}

function localeLabel(locale: keyof typeof LOCALE_META): string {
  const localeMeta = LOCALE_META[locale]
  return `${localeMeta.nativeName} (${locale})`
}

export function renderLlmsTxt(posts: readonly PostEntry[]): string {
  const latestPosts = posts.slice(0, 12)

  return [
    `# ${SITE_CONFIG.name}`,
    "",
    `> ${SITE_CONFIG.description}. A concise index for site structure, recent content, and official entry points.`,
    "",
    `- Repository: ${SITE_CONFIG.repository}`,
    `- Supported locales: ${LOCALES.map((locale) => localeLabel(locale)).join(", ")}`,
    `- Default locale: ${localeLabel(DEFAULT_LOCALE)}`,
    "",
    "## Core",
    "",
    `- [Home](${SITE_CONFIG.url}/${DEFAULT_LOCALE}/)`,
    `- [Search](${SITE_CONFIG.url}/${DEFAULT_LOCALE}/search/)`,
    `- [All posts](${SITE_CONFIG.url}/${DEFAULT_LOCALE}/posts/)`,
    `- [llms-full.txt](${SITE_CONFIG.url}/llms-full.txt): Full post index with categories, tags, and publication dates.`,
    "",
    "## Content endpoints",
    "",
    `- [English RSS](${SITE_CONFIG.url}/en/rss.xml)`,
    `- [Chinese RSS](${SITE_CONFIG.url}/zh/rss.xml)`,
    `- [Sitemap](${SITE_CONFIG.url}/sitemap.xml)`,
    `- [Robots](${SITE_CONFIG.url}/robots.txt)`,
    "",
    "## Recent posts",
    "",
    ...latestPosts.map(
      (post) =>
        `- [${post.data.title}](${canonicalPostUrl(post)}): ${post.data.description}`
    ),
    "",
  ].join("\n")
}

export function renderLlmsFullTxt(posts: readonly PostEntry[]): string {
  const lines = [
    "# Polyglow llms-full.txt",
    "",
    `Site: ${SITE_CONFIG.url}`,
    `Generated from ${posts.length} published posts.`,
    `Repository: ${SITE_CONFIG.repository}`,
    "",
    "## Core references",
    `- [Home](${SITE_CONFIG.url}/${DEFAULT_LOCALE}/)`,
    `- [llms.txt](${SITE_CONFIG.url}/llms.txt): Concise index summary`,
    "",
    "## All posts",
    "",
  ]

  for (const locale of LOCALES) {
    const localePosts = posts.filter((post) => post.data.locale === locale)
    if (localePosts.length === 0) continue

    lines.push(`### ${localeLabel(locale)}`, "")

    for (const post of localePosts) {
      const categorySlug = postCategorySlug(post)
      const category = getCategory(categorySlug)
      const tags = postTagSlugs(post)
        .map((tag) => getTag(tag)?.labelByLocale[locale] ?? tag)
        .join(", ")
      lines.push(
        `- [${post.data.title}](${canonicalPostUrl(post)})`,
        `  - Description: ${post.data.description}`,
        `  - Category: ${category?.labelByLocale[locale] ?? categorySlug}`,
        `  - Tags: ${tags || "None"}`,
        `  - Published: ${post.data.pubDate.toISOString().slice(0, 10)}`
      )
    }

    lines.push("")
  }

  lines.push("## Optional")
  lines.push("- [Sitemap](/sitemap.xml)")

  return lines.join("\n")
}
