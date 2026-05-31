# Polyglow Agent Authentication

Polyglow publishes public editorial pages and optional x402 protected API probes.

## Current Access Model

- Public pages do not require account authentication.
- `/api` and `/api/v1` require x402 payment when the runtime gateway is enabled.
- Payment requirements are returned in the HTTP 402 `payment-required` header.
- No pre-registration is required for public content discovery.

## x402 Flow

1. Request `/api` or `/api/v1`.
2. Read the `payment-required` header from the HTTP 402 response.
3. Complete payment through an x402-compatible facilitator and network supported by the deployment.
4. Retry the same endpoint with the payment proof headers required by the x402 protocol.

## OAuth and OIDC

Polyglow does not publish an OAuth authorization server, OpenID Provider, token endpoint, JWKS endpoint, or dynamic client registration endpoint for this static deployment.

Agents should not use OAuth or OIDC for this deployment. Use the x402 payment challenge on the protected API endpoints instead.

