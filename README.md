# MyPriceBook Pay

Cloud-first pharmacy payment reconciliation and business intelligence for Nigerian pharmacies and patent medicine shops. MyPriceBook Pay connects verified customer payments to sales, stock movements, receipts, and useful business reporting.

## Project status

The repository includes a React frontend, a versioned FastAPI read API, and a PostgreSQL-backed product catalog. Product records and synthetic development fixtures are available to the Price Book UI. Authentication, product writes, sales, and payment integration have not been implemented. No production credentials belong in source control.

## Architecture at a glance

- Frontend: React, TypeScript, Tailwind CSS, Vite, and React Router, hosted independently on a static frontend platform.
- API: Python and FastAPI, with synchronous SQLAlchemy 2.x repositories and Alembic-managed schema changes.
- Data: PostgreSQL, accessed by the API only. Local development uses Docker Compose; production database infrastructure is not configured here.
- Payments: Kora checkout with server-side verification and signed webhook handling. A browser redirect is never proof of payment.
- Development: GitHub Codespaces with Docker Compose PostgreSQL for local development.

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

Open the repository in GitHub Codespaces and rebuild the devcontainer if prompted so its Docker CLI can use the host Docker service. Copy `.env.example` to the repository-root `.env` to configure safe local-only PostgreSQL credentials. The ignored `.env` file is used by Compose and the API; never commit production secrets.

Never commit `.env`, production credentials, payment secrets, or customer data. See [docs/SECURITY.md](docs/SECURITY.md) for the security plan.

Start the local database, apply the product schema migration, seed synthetic products, and run the API:

```bash
cp .env.example .env
docker compose up -d postgres
cd apps/api
/usr/local/bin/python -m alembic upgrade head
/usr/local/bin/python -m app.scripts.seed_demo
/usr/local/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

In another terminal, run the frontend:

```bash
cd apps/web
npm install
npm run dev
```

The Vite server listens on port `5173` and proxies `/api` requests to FastAPI on port `8000`. Run `npm run typecheck` for TypeScript validation and `npm run build` for the production build. Set `VITE_API_BASE_URL` only when the frontend must call a separately deployed API.

The API keeps its `ProductRepository` boundary: `ProductService` depends on the protocol, and the normal application dependency uses `PostgresProductRepository`. `InMemoryProductRepository` remains available for isolated unit tests and does not back the running API. Product catalog metadata, NGN pricing in integer kobo, and stock balances live in separate related tables. Use Alembic for schema changes; the app does not create tables on startup. Database setup and test details are in [apps/api/README.md](apps/api/README.md).

## Contributions

Contributions should be made by their actual authors through GitHub. Keep changes focused, explain schema and payment-flow decisions in review, and never manufacture commits or contribution history.

## License

See [LICENSE](LICENSE).
