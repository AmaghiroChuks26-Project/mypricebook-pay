# Architecture

## Status and principles

This document defines the intended system before application code or database tables are created. The first release is a modular monolith: one React client, one FastAPI service, and one managed PostgreSQL database. The API owns business rules and is the only application component allowed to access the database or Kora secret credentials. Keep the initial deployment simple while preserving clear boundaries between payment, sales, inventory, and reporting.

The product is for Nigerian pharmacies and patent medicine shops. Amounts are denominated in NGN for the MVP. Persist money as integer minor units (kobo), not floating-point values. Persist timestamps in UTC and apply Africa/Lagos calendar boundaries for business-day reporting.

## System overview

```text
Shop staff browser
    | HTTPS, authenticated REST requests
    v
React + TypeScript + Tailwind (static frontend)
    | HTTPS, versioned JSON API
    v
FastAPI service ----------------------> Kora API / hosted checkout
    |                                      ^
    | SQL over TLS                          | signed webhook over HTTPS
    v                                      |
Managed PostgreSQL <-----------------------+
```

The browser displays checkout state but cannot declare a payment successful. Kora's server-to-server verification and validated webhook are the trusted payment evidence. The backend applies a verified payment, sale confirmation, inventory movements, receipt snapshot, and audit events in controlled database transactions.

## Frontend

- React and TypeScript single-page application, built with Vite when Phase 2 begins; Tailwind CSS for styling.
- Responsive, keyboard-accessible workflows optimized for routine shop-counter use and modest screen sizes.
- Communicate only with the versioned API. The browser may hold a public Kora checkout URL or public key if Kora's chosen checkout flow requires it; it must never receive a secret key, database URL, webhook secret, or authentication signing secret.
- Treat a return from hosted checkout as a request to refresh status from the API, not as proof of payment.
- Keep loading, pending, failed, expired, and confirmed states distinct. Do not optimistically reduce stock or issue a paid receipt.

## Backend

- FastAPI REST API, organized initially as a modular monolith with separate modules for configuration, authentication, shops, catalog/inventory, sales, payments/webhooks, receipts, and reporting.
- Validate request and provider data at boundaries with typed schemas. Put authorization and business invariants in service/domain code, not only in route handlers.
- Use a managed PostgreSQL connection through a migration-managed ORM/query layer selected in the database phase. Do not connect directly from the frontend.
- Keep provider adapters isolated so sandbox and production Kora settings can be changed without leaking provider behavior into sales/inventory rules.
- Make state-changing handlers idempotent where retries are expected. Use structured logs and request/correlation IDs without recording secrets or full payment payloads.

## Database and MVP model

Use PostgreSQL foreign keys, unique constraints, check constraints, and transactions to enforce tenant ownership, valid statuses, positive quantities/prices where applicable, and payment-reference uniqueness. Every shop-owned record must be scoped to a pharmacy/shop. The API must enforce this scope on every read and write; an unguessable ID is not authorization.

Candidate relationships:

- `users` have many `pharmacy_memberships`; each membership joins one user to one `pharmacies` row and carries a role. This supports legitimate multi-shop users without copying accounts.
- A `pharmacies` row owns `products`, `inventory`, and `sales`.
- A product is the MVP sellable stock-keeping unit. `inventory` has one row per pharmacy/product and tracks current on-hand quantity and reservation state. Keep `product_variants` deferred until actual catalog requirements establish how strengths, pack sizes, and brands should be represented; do not create a table just because it is on a candidate list.
- A `sales` row is the checkout/order aggregate. It has many `sale_items`; each item stores immutable product name/SKU and unit-price snapshots plus quantity and line total so later catalog edits do not rewrite history.
- A sale may have multiple `payments` because an attempt can fail and be retried. Each payment records provider, unique provider reference, amount/currency, and a controlled status; never store card credentials.
- `inventory_movements` is an append-only stock ledger linked to the shop and, where relevant, sale/item or a manual adjustment. A unique source/idempotency key prevents a retry from decrementing twice. The inventory balance is updated in the same transaction as its ledger movement.
- `receipts` reference a confirmed sale and preserve the customer-facing sale snapshot/receipt number. A receipt is not proof of payment independent of the sale.
- `audit_logs` capture actor, shop, action, target, timestamp, and limited metadata for security-sensitive changes and manual stock adjustments. Avoid logging sensitive payment/customer data.
- A minimal `webhook_events`/provider-event inbox is needed when webhook delivery is introduced: unique provider event ID, received/processed state, timestamps, and safe diagnostic metadata. Retain raw payload only if justified, access-restricted, and redacted.

MVP implementation should begin with users, pharmacies, memberships, products, inventory, sales, sale items, payments, inventory movements, receipts, audit records, and a webhook-event record when webhook handling is implemented. Confirm column types, indexes, retention, deletion behavior, and migration strategy before creating migrations. Do not create a standalone variants table, warehouse model, or generalized accounting ledger without a demonstrated MVP need. Prefer soft deactivation over deleting referenced business records.

### Transaction and stock invariants

- A checkout begins from a pending sale/order, not a paid sale. Validate product ownership, price, and available quantity on the server.
- To prevent concurrent checkouts overselling stock, reserve requested quantities atomically before opening checkout, with an expiry/release path. The reservation is not a confirmed stock decrement and must be visible to availability checks.
- Confirm a sale only after payment has been verified with Kora. In one database transaction, lock the relevant sale and inventory rows, verify the sale/payment state and reservation, mark the payment verified and sale confirmed, convert reservations into stock-decrement movements, create the receipt snapshot, and record audit events. Enforce idempotency with unique references and state transitions.
- If payment succeeds after a reservation expired or cannot be honored, record a reconciliation exception and do not silently oversell or issue a normal confirmed receipt. Provide an explicit operational/refund resolution path.
- Manual stock adjustments require an authorized actor, a reason, and a ledger movement; never silently overwrite the history.

## Authentication and authorization

Authenticate shop staff through the API. The initial design is email/phone identifier plus password, with passwords hashed using a vetted Argon2id implementation. Use short-lived signed access credentials and a carefully scoped refresh/session mechanism; do not persist long-lived bearer tokens in browser local storage. Prefer secure, HttpOnly, SameSite cookies for refresh/session credentials when the selected frontend/API deployment domains support the required cookie and CORS settings. Revisit this domain constraint before auth implementation. Enforce role and pharmacy membership on every shop-scoped request. Start with owner and staff roles and least privilege; defer elaborate role customization.

## Payment and webhook flow

1. The authenticated client asks the API to create a pending sale from product IDs and quantities. The server prices the sale from its catalog and atomically reserves stock; client-supplied prices are ignored.
2. The client requests checkout for that sale. The API creates a unique payment attempt/reference and initializes Kora checkout server-side using the expected amount, NGN currency, and reference. Only the hosted checkout URL/public data is returned.
3. The customer completes or abandons hosted checkout. A browser redirect can prompt a status refresh but cannot confirm the sale.
4. Kora sends a webhook to the public webhook endpoint. The API validates the signature against the exact raw request bytes using the current Kora specification, rejects invalid signatures, records the event idempotently, and responds promptly. A valid signature identifies an authentic notification but is not by itself sufficient evidence for all payment fields.
5. The backend independently verifies the payment/reference with Kora's server API using the secret key. Check that the provider reference matches, the amount and currency match the pending payment/sale, and the provider status is a final success. Never trust a frontend success flag.
6. Apply the verified state and inventory/receipt changes transactionally. Repeated webhooks, browser status refreshes, and provider verification retries must converge on one result.
7. A scheduled/retryable reconciliation process can recheck stale pending attempts and missed webhooks. It must be idempotent and must not mark unknown states as paid.

The authoritative signature header, signature algorithm, timestamp/replay rules, and verification endpoint must be confirmed from Kora's current official integration documentation before implementation; do not guess provider protocol details.

## Receipt flow

Generate a receipt only for a confirmed sale. Assign a unique, human-readable receipt number within a documented scope (for example, per shop and date or a globally unique sequence). Store an immutable snapshot of shop details, item descriptions, quantities, prices, totals, currency, payment reference/status, and sale time. Render/download or print from that server-authoritative record. Avoid collecting customer identity unless the business workflow requires it; protect any retained personal data.

## Analytics

The first dashboard should derive modest operational metrics from confirmed sales and stock: sales totals/counts by Africa/Lagos business day, payment outcomes, low-stock items, and recent activity. Pending/failed payments are not revenue. Aggregate using indexed, tenant-scoped queries; never expose one shop's metrics to another. Reconcile dashboard totals to confirmed sale/payment records. Add cached aggregates or materialized views only after measurement shows live queries are insufficient.

## Deployment

- Frontend: Vercel, Netlify, or equivalent static hosting over HTTPS.
- API: Render, Railway, Fly.io, or equivalent managed application hosting over HTTPS with health checks and controlled releases.
- Database: managed PostgreSQL (for example Neon or Supabase PostgreSQL) with TLS, backups, restricted credentials, and separate development/staging/production databases.
- Configure a narrow production CORS allowlist for the deployed frontend origin. Configure callback/webhook URLs and Kora credentials separately per environment.
- Run schema migrations as an explicit release step. Use backward-compatible expand/migrate/contract changes once more than one service version is live.
- No deployment or cloud resource is created in Phase 1. Local/Codespaces API and frontend ports are forwarded only when those applications exist; a managed database can be used when database development starts.

## Environment variables

Use `.env.example` for names and safe local defaults only. Keep real values in Codespaces secrets or the hosting provider's secret manager. Planned configuration includes `APP_ENV`, `API_HOST`, `API_PORT`, `DATABASE_URL`, `VITE_API_BASE_URL`, `CORS_ORIGINS`, `AUTH_SECRET_KEY`, `KORA_BASE_URL`, `KORA_PUBLIC_KEY`, `KORA_SECRET_KEY`, `KORA_WEBHOOK_SECRET`, and `LOG_LEVEL`. Prefix browser-build variables with `VITE_` only when they are intentionally public. Never put database URLs or any secret in a `VITE_` variable.

## Security boundaries

- Browser: untrusted input and presentation only; no privileged credentials, direct database access, or authority to confirm a payment.
- API: validates identity, membership, roles, inputs, state transitions, Kora responses, and webhook signatures; owns all secrets and business decisions.
- Kora: external payment processor; verify each final result server-to-server and reconcile provider events.
- Database: private managed service reachable only by the API/migration identity; tenant isolation enforced in application queries and database constraints.
- Operations: TLS, least-privilege secrets, restricted CORS, rate limits, safe structured logs, backups, dependency updates, and environment separation.

## Data flow and future scalability

A client command creates a pending sale and reservation. The API obtains a Kora checkout and stores a payment attempt. Kora's webhook and/or a client-triggered refresh causes server verification. A single idempotent transition commits payment, sale, stock ledger/balance, receipt, and audit data; analytics read confirmed records. Correlation IDs link the stages without logging secret or sensitive payload values.

Keep modules and interfaces clean enough to extract payment/reconciliation workers later. If traffic or webhook bursts justify it, add a durable queue/outbox and background workers, then read replicas or pre-aggregated reporting. Add multi-warehouse lots/expiry tracking, product variants, offline operation, and advanced analytics only against validated requirements. Avoid microservices and premature infrastructure in the MVP.
