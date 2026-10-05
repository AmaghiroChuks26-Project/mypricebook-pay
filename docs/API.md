# API Plan

This describes the planned HTTP contract and identifies the currently implemented product endpoints. Keep the API versioned under `/api/v1`, use JSON for application requests/responses, and publish an OpenAPI schema from FastAPI. Final field names and status codes should be captured in tests and the generated schema.

## Conventions

- API base path: `/api/v1`; production uses HTTPS.
- Authenticated routes require a valid staff session and server-side membership/role authorization for the requested pharmacy.
- Use ISO 8601 timestamps in UTC. Use integer minor units for money plus an explicit currency (`NGN`); do not send floating-point totals.
- The API calculates product prices, totals, available stock, and payment status. It ignores client claims about successful payment or authoritative prices.
- Paginate list endpoints with bounded page size and stable ordering. Avoid returning unnecessary customer or provider payload data.
- Use a consistent error response with a safe machine-readable code, human-readable message, optional field details, and request/correlation ID. Never include stack traces or secrets in client errors.
- Use idempotency keys for retriable create/checkout operations where appropriate, backed by database uniqueness and documented retention.

## Implemented product foundation

These read-only endpoints are backed by PostgreSQL. The explicit development seed command supplies the synthetic demo records:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/products` | List products; optional `search`, exact `category`, and `status` (`active` or `inactive`) filters |
| `GET` | `/api/v1/products/{product_id}` | Fetch a product by UUID; unknown IDs use the standard API error envelope |

Product responses contain a generic catalog identity (name, SKU, category, unit, and status) plus optional pharmacy-oriented descriptive fields (generic name, brand, strength, dosage form, and pack size). The optional fields allow ordinary retail products without changing the catalog contract. Pricing and stock are separate nested value objects: prices use integer kobo with currency `NGN`, and stock quantities/reorder levels are nonnegative integers. Keeping these values grouped makes their separate pricing and inventory lifecycles explicit; they are response snapshots, not database entities or a claim that stock movements are implemented.

The route calls `ProductService`, which depends on the `ProductRepository` protocol. The normal application path uses `PostgresProductRepository`; `InMemoryProductRepository` remains available for isolated tests. Sample amounts are illustrative synthetic data, not claims about current medicine prices. The product endpoints remain read-only.

The PostgreSQL schema keeps product metadata, NGN pricing (integer kobo), and inventory balances in separate related tables. The repository maps persisted records to the existing response schemas; service filters and public response shapes remain unchanged.

## Planned endpoints

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| `GET` | `/health` | Liveness/readiness status without secret or database detail | Public, minimal |
| `POST` | `/auth/login` | Authenticate and establish a staff session | Public, rate-limited |
| `POST` | `/auth/refresh` | Refresh an eligible session | Session |
| `POST` | `/auth/logout` | Revoke the current session | Session |
| `GET` | `/me` | Current user and authorized shop memberships | Session |
| `GET` | `/pharmacies/{pharmacy_id}/products` | Search/list shop catalog | Shop member |
| `POST` | `/pharmacies/{pharmacy_id}/products` | Create a sellable product | Owner/authorized staff |
| `GET` | `/pharmacies/{pharmacy_id}/inventory` | List on-hand/reserved/available stock | Shop member |
| `POST` | `/pharmacies/{pharmacy_id}/inventory/adjustments` | Record a reasoned manual adjustment | Authorized staff |
| `POST` | `/pharmacies/{pharmacy_id}/sales` | Price a requested basket server-side and create pending sale/reservation | Shop member |
| `GET` | `/pharmacies/{pharmacy_id}/sales/{sale_id}` | Read sale/payment status | Shop member |
| `POST` | `/pharmacies/{pharmacy_id}/sales/{sale_id}/checkout` | Create/reuse a Kora payment attempt and return hosted checkout data | Shop member |
| `GET` | `/pharmacies/{pharmacy_id}/sales/{sale_id}/receipt` | Fetch receipt after confirmed sale | Shop member |
| `GET` | `/pharmacies/{pharmacy_id}/dashboard` | Tenant-scoped operational metrics | Shop member |
| `POST` | `/webhooks/kora` | Receive provider event, validate signature, record idempotently, and trigger server verification | Public transport; signature-authenticated |

Route shapes are proposals and may be refined before implementation. Never expose an endpoint that lets the browser set payment status, directly decrement stock, or create a paid receipt.

## Sale and checkout contract outline

A sale request contains product identifiers and positive quantities, plus an optional idempotency key. The server verifies shop ownership, active products, current prices, and available quantities; it returns a pending sale with server-calculated line snapshots/totals and reservation expiry. A checkout request returns a payment attempt reference and only the Kora data the browser needs to navigate to the hosted checkout.

The status endpoint returns an authoritative state such as `awaiting_payment`, `confirmed`, `failed`, `expired`, or `reconciliation_required`. Exact states and transitions will be aligned with Kora behavior before implementation. The browser refreshes this endpoint after checkout. Only a verified provider result can move the sale to `confirmed`.

## Webhook contract outline

The Kora endpoint accepts the provider's documented method and content type. The implementation reads the raw body for signature validation before JSON transformation, validates the documented signature/replay rules, then parses and validates bounded input. It records provider event identity with a unique constraint and performs server-to-server payment verification. Duplicate deliveries receive a safe idempotent acknowledgement; transient failures are retryable and observable. Exact headers, signature algorithm, acknowledgement body, and response codes must follow Kora's current official documentation.

## Status and error handling

Expected errors include unauthenticated, unauthorized/wrong-shop, not found, validation failure, insufficient/reserved stock, invalid sale state, idempotency conflict, provider unavailable, payment mismatch, and rate limit. Distinguish a provider timeout/unknown result from a definitive failure; an unknown payment is not success and should remain eligible for safe reconciliation. Detailed provider diagnostics stay in restricted structured logs, not API responses.
