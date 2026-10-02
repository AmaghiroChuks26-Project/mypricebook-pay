# MyPriceBook Pay

Cloud-first pharmacy payment reconciliation and business intelligence for Nigerian pharmacies and patent medicine shops. MyPriceBook Pay connects verified customer payments to sales, stock movements, receipts, and useful business reporting.

## Project status

Phase 1 (architecture and repository planning) is complete. Phase 2 has established the React frontend foundation, responsive visual system, landing and account-entry pages, dashboard shell, and route placeholders. The dashboard uses clearly labelled fictional demo figures. The API, database schema, authentication, and payment integration have not been implemented. No payment or database credentials belong in source control.

## Architecture at a glance

- Frontend: React, TypeScript, Tailwind CSS, Vite, and React Router, hosted independently on a static frontend platform.
- API: Python and FastAPI, deployed as a cloud service.
- Data: managed PostgreSQL, accessed by the API only.
- Payments: Kora checkout with server-side verification and signed webhook handling. A browser redirect is never proof of payment.
- Development: GitHub Codespaces with no local database or Docker requirement; use a managed development database when database work begins.

The planned components and security boundaries are described in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). The sequence of implementation is in [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md).

## Repository layout

```text
apps/
	api/                 FastAPI service (planned)
	web/                 React web client (Phase 2 foundation)
		src/components/    Shared UI and application layout
		src/lib/           Demo data and formatting utilities
		src/pages/         Landing, dashboard, and placeholder pages
		src/routes/        React Router configuration
		src/styles.css     Tailwind entry and design system
docs/                  Architecture, API, security, UX, and demo plans
tests/                 Automated tests (planned)
.devcontainer/         GitHub Codespaces configuration
.env.example           Names and local defaults for future configuration
```

The web app is a frontend-only foundation. Demo values are fictional and live in `apps/web/src/lib/demoData.ts`; there are no API calls or real shop records.

## Development environment

Open the repository in GitHub Codespaces. The devcontainer provides a Python and Node.js toolchain and forwards the planned frontend and API ports. No PostgreSQL server is installed in the Codespace. Database-backed work will use a managed PostgreSQL instance configured with environment variables.

Before implementation begins, copy `.env.example` to an ignored local `.env` only when needed and supply your own non-production values. Never commit `.env`, real credentials, payment secrets, or customer data. See [docs/SECURITY.md](docs/SECURITY.md) for the security plan.

Run the frontend in Codespaces:

```bash
cd apps/web
npm install
npm run dev
```

The Vite server listens on port `5173`, forwarded by the Codespaces devcontainer. Run `npm run typecheck` for TypeScript validation and `npm run build` for the production build. The frontend does not require a local database, API server, or environment secrets at this phase.

## Contributions

Contributions should be made by their actual authors through GitHub. Keep changes focused, explain schema and payment-flow decisions in review, and never manufacture commits or contribution history.

## License

See [LICENSE](LICENSE).
