# Security Plan

Security is part of each implementation phase, not a final polish task. This is a planning document; controls become release gates as the corresponding features are built.

## Secrets and environment variables

- Commit only `.env.example` with names and empty or safe local values. `.env` and `.env.*` are ignored, except `.env.example`.
- Store development secrets in Codespaces secrets and deployed secrets in the hosting provider's secret manager. Never paste secrets into source, issues, logs, screenshots, or client-side build variables.
- Keep Kora secret/webhook keys, authentication signing keys, and database credentials on the API/migration side. Any `VITE_` variable is public after build; only the API base URL or other public configuration belongs there.
- Use separate credentials and keys per environment, rotate them after exposure, and restrict production secret access to the smallest practical set of operators/services.

## Payment verification and webhook authenticity

- A client redirect, query parameter, screenshot, or client-submitted status is never proof of payment.
- Verify the provider reference, final provider status, amount, and NGN currency server-to-server with Kora before confirming a sale.
- Verify webhook signatures using the exact raw bytes and the algorithm/header/replay rules documented by Kora. Reject invalid signatures before processing. Confirm the current Kora contract before coding; do not invent header names or cryptographic details.
- Make event and payment processing idempotent with unique provider event/reference constraints and transactional state transitions. Handle retries, out-of-order events, provider timeout, duplicate delivery, and late success explicitly.
- Keep payment state separate from sale state. Do not issue a receipt or decrement stock twice. Never collect or store card number, CVV, PIN, or other payment credentials.
- Redact webhook payloads and provider responses. Retain only data needed for verification, support, and legally appropriate reconciliation.

## Authentication and authorization

- Hash passwords with a maintained Argon2id library and safe parameters; never store plaintext or reversible passwords.
- Use short-lived access credentials and a secure session/refresh strategy. Do not store long-lived tokens in local storage. Use TLS-only, HttpOnly, appropriately SameSite cookies for session credentials if the deployment domain arrangement supports them; protect cookie-based state changes against CSRF.
- Enforce authorization on the server for every action and every pharmacy-scoped object. Resolve shop membership from the authenticated principal, not a trusted client-supplied tenant identifier. Deny by default and test cross-tenant access.
- Apply role checks to manual stock adjustments, user administration, receipts, and shop settings. Re-authentication or stronger controls for sensitive owner actions can be added as requirements emerge.

## Database access and data integrity

- Use managed PostgreSQL with TLS and a private/restricted network path where available. Only the API and migration process should connect; never expose a database credential to the browser.
- Use separate least-privilege credentials for runtime and schema migrations where the provider supports it. Restrict grants and rotate credentials.
- Use parameterized queries/ORM bindings, transactions, foreign keys, unique constraints, and status/quantity constraints. Do not build SQL from untrusted strings.
- Back up production data, define retention and restoration procedures, and test a restore before relying on backups. Use non-production data in development and demo environments.

## Input validation and application protections

- Validate and bound all path, query, and body fields, including IDs, quantities, currency, dates, upload sizes (if uploads are later added), and pagination. Recalculate all prices and totals on the server.
- Use explicit state machines for sales and payments; reject invalid transitions. Use idempotency keys/unique constraints on retried writes.
- Rate-limit login, checkout creation, public webhook/status routes as appropriate. Set request/body/time limits and provider timeouts. Avoid blocking webhook acknowledgement on unnecessary dashboard work.
- Configure production CORS to exact trusted frontend origins; never use wildcard origins with credentials. CORS is not an authentication mechanism.
- Use HTTPS everywhere outside local development. Configure secure headers and production cookies at the hosting edge/API.

## Logging, monitoring, and sensitive data

- Use structured logs with correlation IDs, actor/shop IDs when appropriate, event type, outcome, and timing. Never log passwords, tokens, secret keys, full card/payment credentials, or unredacted personal/provider payloads.
- Collect only customer data needed for the receipt/business requirement. Document access, retention, and deletion expectations before collecting personal identifiers.
- Restrict access to logs, audit records, database backups, and payment reconciliation views. Audit sensitive administrative and inventory actions without copying unnecessary personal data into audit metadata.
- Alert on repeated signature failures, verification mismatches, unusual login attempts, processing backlogs, and reconciliation exceptions without exposing secrets in alert text.

## Production configuration and operations

- Fail closed when required production keys, origins, TLS/proxy settings, or database configuration are missing. Do not enable debug mode or interactive API docs publicly in production without an explicit need and access control.
- Use separate dev/staging/production services and Kora credentials; do not send real customer payments through sandbox or sandbox data through production.
- Pin and review dependencies through lockfiles once implementation begins; apply security updates and scan dependencies in CI.
- Apply schema migrations as an audited release step, preserve rollback/forward-fix plans, and verify backups, health checks, monitoring, and incident/credential-rotation procedures before launch.
