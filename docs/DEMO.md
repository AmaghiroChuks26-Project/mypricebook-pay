# Demo Plan

The eventual demo must show the business result, not just a dashboard mock. This is a preparation plan; no live payment flow, sample data, or credentials exist in Phase 1.

## Demonstration path

1. A shop owner signs in to a clearly fictional pharmacy account.
2. The owner views the catalog and on-hand/reserved stock.
3. The user selects products and quantities; the API prices the basket and creates a pending sale with a stock reservation.
4. The API creates a Kora sandbox checkout and the customer is sent to hosted checkout.
5. The customer completes the sandbox transaction; the browser return page shows a pending state until the backend reports a verified outcome.
6. Kora's sandbox webhook is signature-validated and the payment is independently verified server-to-server.
7. The sale becomes confirmed once; the reservation is converted into a stock movement and the on-hand balance decreases once.
8. A receipt for the confirmed sale becomes available with the correct item/amount/payment reference.
9. The dashboard reflects the confirmed transaction and updated stock using the shop's Africa/Lagos business day.
10. Replaying a webhook or refreshing checkout status demonstrates that no duplicate sale, stock decrement, or receipt is produced.

## Demo readiness

- Use fictional shop, staff, and product data with no real customer details.
- Use Kora sandbox credentials supplied through Codespaces/hosting secrets at runtime; never commit or display them.
- Document sandbox setup, test payment procedure, webhook tunnel/hosting requirement, reset process, and known provider limitations when integration is implemented.
- Show pending, success, failure, and retry/reconciliation states; don't present a mocked success as a verified payment.
- Keep a scripted fallback (pre-recorded/synthetic data clearly labeled) if sandbox or webhook delivery is unavailable. Do not imply a fallback transaction was processed by Kora.
- Before the demo, reconcile receipt, sale, payment, stock ledger, inventory balance, and dashboard values for the same reference.
