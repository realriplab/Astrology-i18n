# Polyglow Optional x402 Gateway Design

## Goal

Polyglow remains a static-first Astro theme while offering a real x402 payment gateway for deployments that support runtime request handling. Static hosting continues to work without private services, databases, credentials, or payment settings.

## Architecture

The core site still builds to `dist` with `output: "static"`. A new optional Cloudflare Worker adapter wraps those static assets only when the deployer opts in through runtime variables. The adapter checks whether a request targets a protected content route and whether the requester looks like a bot. Human traffic and unsupported platforms receive the same static pages as before.

When x402 is enabled and a protected bot request has no valid payment, the Worker returns `402 Payment Required` using `@x402/hono`. When payment is valid, the request is served from the static assets binding. The payment gateway is platform-specific, but the configuration shape is kept small enough to reuse for future Vercel, Netlify, and Node adapters.

## Scope

This phase implements the Cloudflare adapter only. It does not make Cloudflare mandatory, does not add databases, and does not require wallet addresses in source. Other platforms can still deploy the static `dist` output; they simply do not get runtime x402 enforcement until a matching adapter is added.

## Configuration

Runtime variables control the gateway:

- `X402_ENABLED`: `true` enables runtime enforcement.
- `X402_PAY_TO`: destination wallet address.
- `X402_NETWORK`: CAIP-2 network identifier. The default follows the Solana network currently advertised by `https://x402.org/facilitator/supported`: `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`.
- `X402_PRICE`: default price, default `$0.01`, with production examples using `$0.08`.
- `X402_FACILITATOR_URL`: facilitator URL, default `https://x402.org/facilitator`.
- `X402_BOT_ONLY`: default `true`.
- `X402_BOT_SCORE_THRESHOLD`: default `30`.
- `X402_PROTECTED_PATTERNS`: comma-separated route prefixes, default locale post routes and `/api` probes.

Cloudflare Bot Management score is used when available. If Bot Management data is absent, the adapter falls back to known bot user-agent tokens for local testing and lower-tier deployments.

## Verification

Source-level checks verify that the static build remains unchanged, the Cloudflare Worker is opt-in, the Worker exposes `/api` and `/api/v1` probes, and x402 dependency wiring is present. Build verification remains `pnpm build`; gateway verification uses a focused script and Wrangler dry run where available.

Production verification checks `GET /api` and `GET /api/v1`. When enabled correctly, both return `402 Payment Required` with a `payment-required` header. This was verified for `https://polyglow.realrip.com/api` and `https://polyglow.realrip.com/api/v1` on 2026-05-31.
