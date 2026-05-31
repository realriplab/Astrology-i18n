# auth.md - Polyglow Agent Authentication

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

## Agent Registration

Polyglow accepts anonymous agent discovery and x402-paid API access. No human account, dashboard account, or pre-registration is required for read-only content discovery.

Agents that require a registration document can use this file as the registration entrypoint.

Registration endpoint: `https://polyglow.realrip.com/auth.md`

register_uri: `https://polyglow.realrip.com/auth.md`

agent_auth metadata:

```json
{
  "skill": "https://polyglow.realrip.com/auth.md",
  "register_uri": "https://polyglow.realrip.com/auth.md",
  "claim_uri": "https://polyglow.realrip.com/api",
  "revocation_uri": "https://polyglow.realrip.com/auth.md#revocation-uri",
  "identity_types_supported": ["anonymous"],
  "anonymous": {
    "credential_types_supported": ["x402"]
  },
  "events_supported": []
}
```

Supported identity types:

- `anonymous`

Supported credential types:

- `x402`

Credential claim URI:

- `https://polyglow.realrip.com/api`

Revocation URI:

- Not applicable. Polyglow does not issue persistent bearer credentials.
- `revocation_uri`: `https://polyglow.realrip.com/auth.md#revocation-uri`

Registration method:

- `POST /agent/auth`: Not available for this deployment. Polyglow does not create user accounts or issue persistent API keys.
- Agents register for paid access by completing the x402 challenge returned by `/api` or `/api/v1`.

Protected API probes:

- `/api`
- `/api/v1`

Payment challenge location:

- HTTP 402 `payment-required` response header

How agents register:

1. No pre-registration is required for public content discovery.
2. For paid API access, request `/api` or `/api/v1`.
3. Read the HTTP 402 `payment-required` header.
4. Complete the x402 payment challenge.
5. Retry the same endpoint with the x402 payment proof.

## OAuth and OIDC Discovery

Polyglow publishes static OAuth/OIDC discovery metadata so agents can distinguish OAuth discovery from x402 payment discovery. The current public deployment does not issue bearer tokens for content access.

Well-known metadata links:

- OAuth Protected Resource Metadata: `https://polyglow.realrip.com/.well-known/oauth-protected-resource`
- OAuth Authorization Server Metadata: `https://polyglow.realrip.com/.well-known/oauth-authorization-server`

Use the x402 payment challenge on the protected API endpoints for paid access.
