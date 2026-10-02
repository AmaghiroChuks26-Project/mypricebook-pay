# Build Plan

Work phase by phase. Each phase should have a reviewable outcome and focused verification before moving on. Keep the first release a modular monolith and do not build later phases early.

1. **Repository and architecture**: inspect existing work, record system/data/security decisions, establish ignore rules and Codespaces setup. **Complete.**
2. **Frontend foundation**: create the React/TypeScript/Vite app, Tailwind setup, routing/layout, responsive design tokens, and API client boundary. Verify a production build and accessible shell. **Complete.**
3. **Backend foundation**: create the FastAPI app, settings, health endpoint, API version prefix, typed error envelope, and test setup. Verify startup and API tests in Codespaces. **Next.**
4. **Database/schema**: choose ORM/migration tooling, provision a managed development PostgreSQL database, model tenant keys and constraints, and add initial migrations. Test migrations against a disposable/managed database; do not require local database software.
5. **Authentication and users**: implement password hashing, login/session lifecycle, logout, account provisioning, and authorization tests. Never trust user/shop IDs from the client without membership checks.
6. **Pharmacy/shop setup**: implement pharmacy profile, membership, owner/staff roles, and tenant-scoping tests.
7. **Products and inventory**: implement sellable products, stock balances, adjustment ledger, low-stock data, and atomic availability/reservation primitives. Test concurrent and duplicate changes.
8. **Sales**: implement server-priced pending sales and sale items, state transitions, idempotency, and expiring inventory reservations. No payment provider dependency yet; exercise the lifecycle with controlled test fixtures.
9. **Kora sandbox payment integration**: confirm current Kora documentation, configure sandbox secrets, create payment attempts/checkouts from the API, and handle provider timeouts without trusting the browser.
10. **Payment verification/webhooks**: validate signatures from raw bytes per Kora's current specification, verify payment server-to-server, add an idempotent event inbox/retries, and test replay, duplicate, mismatched amount/currency/reference, and late-payment cases.
11. **Stock reconciliation**: atomically convert reservations into stock movements only after verified payment; add expired reservation and late-payment exception handling, reconciliation views, and audit trails.
12. **Receipts**: issue immutable receipt snapshots only for confirmed sales; add receipt lookup/print/download and unique receipt-number constraints.
13. **Dashboard/analytics**: display tenant-scoped confirmed revenue, sales counts, payment outcomes, and low stock using Lagos business-day boundaries; reconcile aggregates against source records.
14. **Error handling/security**: review authorization, validation, rate limits, CORS, secret handling, logging, retention, dependency updates, and production settings. Address findings before release.
15. **Testing**: add unit, API integration, database, payment-contract, idempotency, concurrency, and end-to-end workflow coverage; use Kora sandbox and non-production data only.
16. **Cloud deployment**: configure frontend/API hosting and managed PostgreSQL, separate environments/secrets, migrations, TLS, health checks, backups, monitoring, and rollback procedure. Deploy only when explicitly approved.
17. **Demo preparation**: seed clearly fictional shop/products, prepare sandbox instructions and accounts safely, rehearse the end-to-end flow, and document reset/troubleshooting steps. Never commit real credentials or customer data.

## Completion gates

- Payment success is server-verified and cannot be asserted by the browser.
- A duplicate callback/retry cannot duplicate revenue, receipt, or stock decrement.
- Tenant authorization is tested for all shop-scoped resources.
- A confirmed sale, its payment, stock movement, and receipt reconcile to the same amount and references.
- Secrets are provided out of band, and no cloud deployment happens without explicit approval.
