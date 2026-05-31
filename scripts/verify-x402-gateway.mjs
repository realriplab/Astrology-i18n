import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
}

const packageJson = JSON.parse(read("package.json"))
assert.ok(packageJson.dependencies.hono, "hono must be installed")
assert.ok(packageJson.dependencies["@x402/hono"], "@x402/hono must be installed")
assert.ok(packageJson.dependencies["@x402/svm"], "@x402/svm must be installed")
assert.ok(packageJson.dependencies["@x402/core"], "@x402/core must be installed")

const wrangler = JSON.parse(read("wrangler.jsonc"))
assert.equal(wrangler.main, "src/x402/cloudflare-worker.ts")
assert.deepEqual(wrangler.compatibility_flags, ["nodejs_compat"])
assert.equal(wrangler.assets.binding, "ASSETS")
assert.ok(wrangler.assets.run_worker_first.includes("/api"))
assert.ok(wrangler.assets.run_worker_first.includes("/en/posts/*"))
assert.equal(wrangler.vars.X402_ENABLED, "false")
assert.equal(wrangler.vars.X402_NETWORK, "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1")

const worker = read("src/x402/cloudflare-worker.ts")
assert.match(worker, /paymentMiddleware/)
assert.match(worker, /ExactSvmScheme/)
assert.match(worker, /HTTPFacilitatorClient/)
assert.match(worker, /X402_PAY_TO/)
assert.match(worker, /botManagement/)
assert.match(worker, /env\.ASSETS\.fetch/)
assert.match(worker, /app\.get\("\/api"/)
assert.match(worker, /app\.get\("\/api\/v1"/)
assert.doesNotMatch(
  worker,
  /paymentMiddleware\([^)]*,\s*false\)/,
  "x402 gateway must initialize facilitator support before building payment requirements"
)

console.log("x402 gateway source checks passed.")
