import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import assert from "node:assert/strict"

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
}

function readJson(path) {
  return JSON.parse(read(path))
}

const robotsSource = read("src/pages/robots.txt.ts")
assert.match(robotsSource, /sitemap-index\.xml/, "robots.txt must advertise sitemap-index.xml")

const siteConfigSource = read("src/config/site.ts")
assert.match(
  siteConfigSource,
  /https:\/\/polyglow\.realrip\.com/,
  "default SITE_CONFIG.url must match the production domain"
)

const astroConfigSource = read("astro.config.mjs")
assert.match(
  astroConfigSource,
  /https:\/\/polyglow\.realrip\.com/,
  "default Astro site must match the production domain"
)

const agentMarkdownSource = read("src/utils/agent-markdown.ts")
assert.match(agentMarkdownSource, /sitemap-index\.xml/, "llms files must advertise sitemap-index.xml")

const headers = read("public/_headers")
assert.match(headers, /<\/llms\.txt>;\s*rel="service-doc"/, "_headers must link llms.txt")
assert.match(headers, /<\/llms-full\.txt>;\s*rel="service-doc"/, "_headers must link llms-full.txt")
assert.match(
  headers,
  /<\/\.well-known\/agent-skills\/index\.json>;\s*rel="service-desc"/,
  "_headers must link the agent skills index"
)
assert.match(
  headers,
  /<\/\.well-known\/api-catalog>;\s*rel="api-catalog"/,
  "_headers must expose the API catalog link relation"
)
assert.match(
  headers,
  /\/\.well-known\/api-catalog\s*\n\s*Content-Type:\s*application\/linkset\+json/,
  "_headers must serve API catalog with application/linkset+json"
)
assert.match(
  headers,
  /\/auth\.md\s*\n\s*Content-Type:\s*text\/markdown/,
  "_headers must serve auth.md as Markdown"
)
assert.match(
  headers,
  /\/\.well-known\/oauth-authorization-server\s*\n\s*Content-Type:\s*application\/json/,
  "_headers must serve OAuth authorization server metadata as JSON"
)
assert.match(
  headers,
  /\/\.well-known\/oauth-protected-resource\s*\n\s*Content-Type:\s*application\/json/,
  "_headers must serve OAuth protected resource metadata as JSON"
)

const apiCatalog = readJson("public/.well-known/api-catalog")
assert.ok(Array.isArray(apiCatalog.linkset), "API catalog must contain a linkset array")
assert.ok(
  apiCatalog.linkset.some(
    (entry) =>
      entry.anchor === "https://polyglow.realrip.com/api" &&
      Array.isArray(entry["service-desc"]) &&
      entry["service-desc"].some((link) => link.href === "https://polyglow.realrip.com/openapi.json") &&
      Array.isArray(entry["service-doc"]) &&
      entry["service-doc"].some((link) => link.href === "https://polyglow.realrip.com/auth.md") &&
      Array.isArray(entry.status) &&
      entry.status.some((link) => link.href === "https://polyglow.realrip.com/api")
  ),
  "API catalog must describe the x402 API with service-desc, service-doc, and status links"
)

const openApi = readJson("public/openapi.json")
assert.equal(openApi.openapi, "3.1.0")
assert.equal(openApi.info.title, "Polyglow x402 API")
assert.ok(openApi.paths["/api"], "OpenAPI spec must describe /api")
assert.ok(openApi.paths["/api/v1"], "OpenAPI spec must describe /api/v1")
assert.ok(
  openApi.components?.securitySchemes?.x402,
  "OpenAPI spec must document x402 payment requirements"
)

const authMd = read("public/auth.md")
assert.match(authMd, /^# .*auth\.md/im)
assert.match(authMd, /x402/)
assert.match(authMd, /Agent Registration/)
assert.match(authMd, /Registration endpoint:/)
assert.match(authMd, /agent_auth metadata:/)
assert.match(authMd, /register_uri:/)
assert.match(authMd, /claim_uri/)
assert.match(authMd, /revocation_uri/)
assert.match(authMd, /Supported identity types:/)
assert.match(authMd, /anonymous/)
assert.match(authMd, /Supported credential types:/)
assert.match(authMd, /Credential claim URI:/)
assert.match(authMd, /Revocation URI:/)
assert.match(authMd, /POST \/agent\/auth/)
assert.match(authMd, /How agents register:/)
assert.match(authMd, /\.well-known\/oauth-protected-resource/)
assert.match(authMd, /\.well-known\/oauth-authorization-server/)

const oauthMetadata = readJson("public/.well-known/oauth-authorization-server")
assert.equal(oauthMetadata.issuer, "https://polyglow.realrip.com")
assert.ok(oauthMetadata.authorization_endpoint, "OAuth metadata must include authorization_endpoint")
assert.ok(oauthMetadata.token_endpoint, "OAuth metadata must include token_endpoint")
assert.ok(oauthMetadata.jwks_uri, "OAuth metadata must include jwks_uri")
assert.ok(Array.isArray(oauthMetadata.grant_types_supported))
assert.ok(oauthMetadata.agent_auth?.register_uri, "OAuth metadata must include agent_auth.register_uri")
assert.ok(oauthMetadata.agent_auth?.claim_uri, "OAuth metadata must include agent_auth.claim_uri")
assert.ok(oauthMetadata.agent_auth?.revocation_uri, "OAuth metadata must include agent_auth.revocation_uri")

const protectedResource = readJson("public/.well-known/oauth-protected-resource")
assert.equal(protectedResource.resource, "https://polyglow.realrip.com")
assert.ok(Array.isArray(protectedResource.authorization_servers))
assert.ok(protectedResource.authorization_servers.includes("https://polyglow.realrip.com"))
assert.ok(Array.isArray(protectedResource.scopes_supported))
assert.ok(protectedResource.bearer_methods_supported.includes("header"))

const openidConfiguration = readJson("public/.well-known/openid-configuration")
assert.equal(openidConfiguration.issuer, oauthMetadata.issuer)

const jwks = readJson("public/.well-known/jwks.json")
assert.ok(Array.isArray(jwks.keys), "JWKS must contain a keys array")

const worker = read("src/x402/cloudflare-worker.ts")
assert.match(worker, /text\/markdown/, "Worker must negotiate text/markdown")
assert.match(worker, /x-markdown-tokens/, "Worker must emit x-markdown-tokens")

const layout = read("src/layouts/main.astro")
assert.match(layout, /navigator\.modelContext/, "Layout must register WebMCP tools")
assert.match(layout, /registerTool/, "Layout must call WebMCP registerTool")

const skill = read("public/.well-known/agent-skills/polyglow-content/SKILL.md")
const skillDigest = createHash("sha256").update(skill).digest("hex")
const skillsIndex = readJson("public/.well-known/agent-skills/index.json")
assert.equal(skillsIndex.$schema, "https://agentskills.io/schemas/skills-index/v0.2.0.json")
assert.ok(Array.isArray(skillsIndex.skills), "skills index must contain a skills array")
assert.ok(
  skillsIndex.skills.some(
    (entry) =>
      entry.name === "polyglow-content" &&
      entry.type === "skill-md" &&
      entry.sha256 === skillDigest
  ),
  "skills index must reference polyglow-content with the correct sha256"
)

const mcpCard = readJson("public/.well-known/mcp/server-card.json")
assert.equal(mcpCard.serverInfo.name, "Polyglow Content")
assert.equal(mcpCard.transport.type, "none")

const agentCard = readJson("public/.well-known/agent-card.json")
assert.equal(agentCard.name, "Polyglow Content")
assert.ok(Array.isArray(agentCard.skills), "agent card must expose skills")

console.log("Agent readiness source checks passed.")
