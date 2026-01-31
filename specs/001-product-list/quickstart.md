# Quickstart: Product Listing (Available Products)

**Date**: 2026-01-28  
**Feature**: ./spec.md

## Prerequisites

- Java 17 installed
- Node.js LTS installed
- PostgreSQL available locally (or via container)

## Backend (Spring Boot)

From repository root:

1. Configure database connection via environment variables (recommended) or `backend/src/main/resources/application.yml`.
2. Ensure PostgreSQL database exists (example database name: `product_list`).
3. Start the API server:

   - `mvn -f backend/pom.xml spring-boot:run`

Expected outcome:
- API available at `http://localhost:8080`
- Health endpoint available (as implemented) for basic uptime checks.

## Frontend (React)

From repository root:

1. Install dependencies:

   - `npm --prefix frontend install`

2. Configure API base URL (defaults to `http://localhost:8080`). If needed, set `VITE_API_BASE_URL`.

3. Start the dev server:

   - `npm --prefix frontend run dev`

Expected outcome:
- UI available at `http://localhost:5173` (Vite default port)
- Product list page loads products from `/api/v1/products`.

## Smoke Test

- Open the UI and confirm the product list renders.
- Search by name and confirm results narrow.
- Filter by category and confirm results narrow.
- Change sorting and confirm order changes.
- Navigate between pages and confirm state persists.
- Temporarily make the API unavailable and confirm a clear error + retry UX exists.
