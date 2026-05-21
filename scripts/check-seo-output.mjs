import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"

const distDir = join(process.cwd(), "dist")
const siteUrl = (
  process.env.PUBLIC_SITE_URL ?? "https://polyglow.realrip.com"
).replace(/\/$/, "")
const localeHreflang = {
  zh: "zh-CN",
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  ru: "ru-RU",
  ja: "ja-JP",
  ko: "ko-KR",
  pt: "pt-PT",
  de: "de-DE",
  id: "id-ID",
  ar: "ar",
}
const locales = Object.keys(localeHreflang)
const hreflangs = new Set([...Object.values(localeHreflang), "x-default"])
const expectedAlternateCount = hreflangs.size
const failures = []

function fail(message) {
  failures.push(message)
}

function walkHtml(dir) {
  const entries = readdirSync(dir)
  return entries.flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return walkHtml(path)
    return entry === "index.html" ? [path] : []
  })
}

function extractAttr(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`, "i"))
  return match?.[1]
}

function hasAttr(tag, name) {
  return new RegExp(`\\s${name}(\\s|=|>|/)`, "i").test(tag)
}

function htmlPathToUrl(file) {
  const rel = relative(distDir, file).split(sep).join("/")
  const path = rel === "index.html" ? "/" : `/${rel.replace(/index\.html$/, "")}`
  return `${siteUrl}${path}`
}

function htmlPathToLocale(file) {
  const rel = relative(distDir, file).split(sep).join("/")
  const locale = rel.split("/")[0]
  return locales.includes(locale) ? locale : undefined
}

function localHrefTarget(href) {
  if (!href.startsWith("/")) return undefined
  const url = new URL(href, siteUrl)
  if (url.origin !== siteUrl) return undefined
  const path = decodeURIComponent(url.pathname)
  if (path.endsWith("/")) return join(distDir, path.slice(1), "index.html")
  if (/\.[a-z0-9]+$/i.test(path)) return join(distDir, path.slice(1))
  return join(distDir, path.slice(1), "index.html")
}

function validateHeadings(file, html) {
  const rel = relative(process.cwd(), file)
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>[\s\S]*?<\/h\1>/gi)]
    .map((match) => ({
      level: Number(match[1]),
      text: match[0].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    }))

  if (headings.length === 0 && rel === "dist/index.html") return

  const h1s = headings.filter((heading) => heading.level === 1)
  if (h1s.length !== 1) fail(`${rel}: expected exactly one h1, found ${h1s.length}`)

  const firstH1Index = headings.findIndex((heading) => heading.level === 1)
  if (firstH1Index > 0) {
    fail(`${rel}: heading appears before h1: ${headings[0]?.text ?? "unknown"}`)
  }

  for (let index = 1; index < headings.length; index += 1) {
    const previous = headings[index - 1]
    const current = headings[index]
    if (current.level > previous.level + 1) {
      fail(`${rel}: heading level jumps from h${previous.level} to h${current.level}`)
    }
  }
}

function validateImages(file, html) {
  const rel = relative(process.cwd(), file)
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0])
  for (const image of images) {
    if (!hasAttr(image, "alt")) fail(`${rel}: image missing alt attribute`)
    if (/(\s)alt(=("")?)?(\s|>|\/)/i.test(image)) {
      fail(`${rel}: image has empty alt attribute`)
    }
  }
}

function validateLinks(file, html) {
  const rel = relative(process.cwd(), file)
  const links = [...html.matchAll(/<a\b[^>]*>/gi)].map((match) => match[0])

  for (const link of links) {
    const href = extractAttr(link, "href")
    if (!href) {
      fail(`${rel}: anchor missing href`)
      continue
    }

    if (extractAttr(link, "target") === "_blank") {
      const relValue = extractAttr(link, "rel") ?? ""
      if (!/\bnoopener\b/i.test(relValue) || !/\bnoreferrer\b/i.test(relValue)) {
        fail(`${rel}: external target link missing noopener noreferrer`)
      }
    }

    if (/^(mailto:|tel:|#|javascript:)/i.test(href)) continue
    const target = localHrefTarget(href)
    if (target && !existsSync(target)) {
      fail(`${rel}: local link target is missing: ${href}`)
    }
  }
}

function validateHtml(file) {
  const rel = relative(process.cwd(), file)
  const html = readFileSync(file, "utf8")
  const expectedUrl = htmlPathToUrl(file)
  const locale = htmlPathToLocale(file)
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim()
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+>/i)?.[0]
  const description = html.match(/<meta[^>]+name="description"[^>]+>/i)?.[0]
  const descriptionContent = extractAttr(description ?? "", "content") ?? ""
  const robots = html.match(/<meta[^>]+name="robots"[^>]+>/i)?.[0]
  const contentLanguage = html.match(
    /<meta[^>]+http-equiv="content-language"[^>]+>/i
  )?.[0]
  const noindex = /content="[^"]*noindex/i.test(robots ?? "")
  const alternates = [...html.matchAll(/<link[^>]+rel="alternate"[^>]+>/gi)]
    .map((match) => match[0])
    .map((tag) => ({
      hreflang: extractAttr(tag, "hreflang"),
      href: extractAttr(tag, "href"),
    }))
    .filter((alternate) => alternate.hreflang && alternate.href)

  validateHeadings(file, html)
  validateImages(file, html)
  validateLinks(file, html)

  if (!title) fail(`${rel}: missing <title>`)
  if (!canonical) fail(`${rel}: missing canonical link`)
  if (!robots) fail(`${rel}: missing robots meta`)

  if (!noindex && canonical && extractAttr(canonical, "href") !== expectedUrl) {
    fail(`${rel}: canonical does not match ${expectedUrl}`)
  }

  if (noindex) {
    if (alternates.length > 0) fail(`${rel}: noindex page has hreflang links`)
    return
  }

  if (!description) fail(`${rel}: missing meta description`)
  if (locale === "en" && rel === "dist/en/index.html") {
    if (title && (title.length < 40 || title.length > 60)) {
      fail(`${rel}: homepage title length is outside 40-60 characters`)
    }
    if (
      descriptionContent.length < 140 ||
      descriptionContent.length > 160
    ) {
      fail(`${rel}: homepage meta description length is outside 140-160 characters`)
    }
    if (!/<h3\b/i.test(html)) {
      fail(`${rel}: homepage missing h3 heading`)
    }
  }
  if (
    locale === "en" &&
    /^dist\/en\/posts\/(?!index\.html)(?!\d+\/)[^/]+\/index\.html$/.test(rel) &&
    (descriptionContent.length < 140 || descriptionContent.length > 160)
  ) {
    fail(`${rel}: article meta description length is outside 140-160 characters`)
  }
  if (!html.includes('name="twitter:site"')) {
    fail(`${rel}: missing twitter:site meta`)
  }
  if (!html.includes('type="application/ld+json"')) {
    fail(`${rel}: missing JSON-LD structured data`)
  }

  if (locale) {
    if (extractAttr(contentLanguage ?? "", "content") !== localeHreflang[locale]) {
      fail(`${rel}: content-language does not match locale`)
    }
    if (alternates.length !== expectedAlternateCount) {
      fail(`${rel}: expected ${expectedAlternateCount} hreflang links`)
    }
    const alternateMap = new Map(
      alternates.map((alternate) => [alternate.hreflang, alternate.href])
    )
    for (const hreflang of hreflangs) {
      if (!alternateMap.has(hreflang)) {
        fail(`${rel}: missing hreflang ${hreflang}`)
      }
    }
    const selfHref = alternateMap.get(localeHreflang[locale])
    if (selfHref !== expectedUrl) {
      fail(`${rel}: hreflang self-reference does not match canonical`)
    }
    const defaultHref = alternateMap.get("x-default")
    if (defaultHref !== alternateMap.get(localeHreflang.en)) {
      fail(`${rel}: x-default does not point to English fallback`)
    }
    for (const href of alternateMap.values()) {
      if (href === `${siteUrl}/`) {
        fail(`${rel}: hreflang points to root redirect URL`)
      }
      const target = localHrefTarget(new URL(href).pathname)
      if (!target || !existsSync(target)) {
        fail(`${rel}: hreflang target is missing: ${href}`)
      }
    }
  }
}

function validateHreflangReciprocity() {
  const htmlFiles = walkHtml(distDir)
  const pages = new Map()

  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8")
    const robots = html.match(/<meta[^>]+name="robots"[^>]+>/i)?.[0]
    const noindex = /content="[^"]*noindex/i.test(robots ?? "")
    if (noindex) continue

    const alternates = [...html.matchAll(/<link[^>]+rel="alternate"[^>]+>/gi)]
      .map((match) => match[0])
      .map((tag) => ({
        hreflang: extractAttr(tag, "hreflang"),
        href: extractAttr(tag, "href"),
      }))
      .filter((alternate) => alternate.hreflang && alternate.href)
    pages.set(htmlPathToUrl(file), {
      rel: relative(process.cwd(), file),
      alternates: new Map(
        alternates.map((alternate) => [alternate.hreflang, alternate.href])
      ),
    })
  }

  for (const [url, page] of pages) {
    for (const [hreflang, href] of page.alternates) {
      if (hreflang === "x-default") continue
      const target = pages.get(href)
      if (!target) {
        fail(`${page.rel}: hreflang target is not indexable: ${href}`)
        continue
      }
      if (![...target.alternates.values()].includes(url)) {
        fail(`${page.rel}: hreflang target does not return link: ${href}`)
      }
    }
  }
}

function readSitemapXml() {
  const aliasPath = join(distDir, "sitemap.xml")
  if (!existsSync(aliasPath)) {
    fail("dist/sitemap.xml: missing conventional sitemap alias")
  }

  const indexPath = join(distDir, "sitemap-index.xml")
  if (!existsSync(indexPath)) {
    fail("dist/sitemap-index.xml: missing sitemap index")
    return ""
  }
  const indexXml = readFileSync(indexPath, "utf8")
  const sitemapUrls = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1]
  )
  const xml = sitemapUrls
    .map((url) => {
      const file = join(distDir, new URL(url).pathname.slice(1))
      if (!existsSync(file)) {
        fail(`${relative(process.cwd(), file)}: sitemap file is missing`)
        return ""
      }
      return readFileSync(file, "utf8")
    })
    .join("\n")

  if (!indexXml.includes(`${siteUrl}/sitemap-0.xml`)) {
    fail("dist/sitemap-index.xml: sitemap URLs do not use configured site URL")
  }

  return xml
}

function validateSitemap() {
  const xml = readSitemapXml()
  if (!xml) return

  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
    (match) => match[1]
  )
  const locs = new Set()

  for (const block of urls) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]
    if (!loc) {
      fail("sitemap: url entry missing loc")
      continue
    }
    locs.add(loc)
    if (loc === `${siteUrl}/`) fail("sitemap: root redirect URL is indexable")
    if (loc.includes("/search/")) fail(`sitemap: search page listed: ${loc}`)
    if (loc.includes("/404/")) fail(`sitemap: 404 page listed: ${loc}`)

    const links = [...block.matchAll(/<xhtml:link[^>]+>/g)].map((match) => {
      const tag = match[0]
      return {
        hreflang: extractAttr(tag, "hreflang"),
        href: extractAttr(tag, "href"),
      }
    })

    if (links.length === 0) continue

    const seen = new Set()
    const map = new Map()
    for (const link of links) {
      if (!link.hreflang || !link.href) {
        fail(`sitemap: malformed hreflang link for ${loc}`)
        continue
      }
      if (seen.has(link.hreflang)) {
        fail(`sitemap: duplicate hreflang ${link.hreflang} for ${loc}`)
      }
      seen.add(link.hreflang)
      map.set(link.hreflang, link.href)
      if (link.href === `${siteUrl}/`) {
        fail(`sitemap: hreflang points to root redirect URL for ${loc}`)
      }
    }

    if (!map.has("x-default")) {
      fail(`sitemap: missing x-default for ${loc}`)
    }
    if (![...map.values()].includes(loc)) {
      fail(`sitemap: loc is not present in its hreflang cluster: ${loc}`)
    }
    if (map.get("x-default") !== map.get(localeHreflang.en)) {
      fail(`sitemap: x-default does not match English URL for ${loc}`)
    }
  }

  for (const file of walkHtml(distDir)) {
    const html = readFileSync(file, "utf8")
    const robots = html.match(/<meta[^>]+name="robots"[^>]+>/i)?.[0]
    const noindex = /content="[^"]*noindex/i.test(robots ?? "")
    const url = htmlPathToUrl(file)
    if (!noindex && !locs.has(url)) {
      fail(`${relative(process.cwd(), file)}: indexable page missing from sitemap`)
    }
    if (noindex && locs.has(url)) {
      fail(`${relative(process.cwd(), file)}: noindex page present in sitemap`)
    }
  }
}

if (!existsSync(distDir)) {
  throw new Error("dist directory does not exist. Run pnpm build first.")
}

for (const file of walkHtml(distDir)) validateHtml(file)
validateHreflangReciprocity()
validateSitemap()

if (failures.length > 0) {
  console.error(`SEO output check failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log("SEO output check passed.")
