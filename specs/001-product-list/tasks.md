# Tasks: Product Listing (Available Products)

**Input**: Design documents from `/specs/001-product-list/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Included (per constitution: automated testing is non-negotiable).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Each task includes exact file paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create repository structure and baseline tooling for backend + frontend.

- [x] T001 Create project directories `backend/` and `frontend/` (repo root)
- [x] T002 Initialize Spring Boot backend skeleton (create `backend/pom.xml` or `backend/build.gradle` and standard `backend/src/main/java/` + `backend/src/test/java/`)
- [x] T003 Initialize React app skeleton (create `frontend/package.json` and functional component structure under `frontend/src/`)
- [x] T004 [P] Add backend configuration files `backend/src/main/resources/application.yml` and `backend/src/main/resources/application-local.yml`
- [x] T005 [P] Add frontend environment configuration pattern in `frontend/src/services/config.ts` (API base URL)
- [x] T006 [P] Add base CSS structure `frontend/src/styles/` with `frontend/src/styles/global.css`
- [x] T007 [P] Add root documentation links in `specs/001-product-list/quickstart.md` if any repo-specific commands are needed

---
## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required before any user story implementation.

- [x] T008 Add database migration framework and initial migration folder `backend/src/main/resources/db/migration/`
- [x] T009 Create initial PostgreSQL schema migration `backend/src/main/resources/db/migration/V1__init_schema.sql` (tables + constraints)
- [x] T010 [P] Add backend persistence configuration (PostgreSQL datasource) in `backend/src/main/resources/application.yml`
- [x] T011 [P] Add global exception handling with stable error response shape in `backend/src/main/java/com/specit/productlist/api/ErrorHandler.java`
- [x] T012 [P] Add request correlation ID support (propagate/generate) + structured logging in `backend/src/main/java/com/specit/productlist/infra/CorrelationIdFilter.java`
- [x] T013 Add backend health endpoint configuration in `backend/src/main/java/com/specit/productlist/api/HealthController.java`
- [x] T014 Add Testcontainers base configuration for PostgreSQL integration tests in `backend/src/test/java/com/specit/productlist/testsupport/PostgresTestBase.java`
- [x] T015 [P] Add OpenAPI contract file validation step (at minimum, keep `specs/001-product-list/contracts/openapi.yaml` as source-of-truth and add a CI hook later)

**Checkpoint**: Foundation ready; user stories can begin.

---

## Phase 3: User Story 1 - View all available products (Priority: P1) 🎯 MVP

**Goal**: A visitor can open the product listing and see available products, including empty and error states.

**Independent Test**: Start backend + frontend; load the product list page and verify:
- available products render
- empty state renders when no products are available
- error state renders with retry when API is unavailable

### Tests for User Story 1

- [x] T016 [P] [US1] Backend integration test for listing available products using Testcontainers in `backend/src/test/java/com/specit/productlist/api/ProductsApiIT.java`
- [x] T017 [P] [US1] Backend integration test for empty state (no available products) in `backend/src/test/java/com/specit/productlist/api/ProductsApiIT.java`
- [x] T018 [P] [US1] Frontend component test for rendering list/empty/error states in `frontend/src/pages/ProductListPage.test.tsx`

### Implementation for User Story 1

- [x] T019 [P] [US1] Create JPA entity `Product` in `backend/src/main/java/com/specit/productlist/model/Product.java`
- [x] T020 [P] [US1] Create JPA entity `Category` in `backend/src/main/java/com/specit/productlist/model/Category.java`
- [x] T021 [P] [US1] Create repository interfaces in `backend/src/main/java/com/specit/productlist/repository/ProductRepository.java` and `backend/src/main/java/com/specit/productlist/repository/CategoryRepository.java`
- [x] T022 [US1] Implement service method to list available products (default sort, basic pagination defaults) in `backend/src/main/java/com/specit/productlist/service/ProductService.java` (depends on T019-T021)
- [x] T023 [US1] Implement GET `/api/v1/products` per contract in `backend/src/main/java/com/specit/productlist/api/ProductsController.java` (depends on T022)
- [x] T024 [P] [US1] Implement typed API client wrapper in `frontend/src/services/apiClient.ts`
- [x] T025 [US1] Implement `getProducts` call in `frontend/src/services/productsApi.ts` (depends on T024)
- [x] T026 [P] [US1] Implement product list UI components in `frontend/src/components/ProductCard.tsx` and `frontend/src/components/ProductList.tsx`
- [x] T027 [US1] Implement page container (load, empty, error, retry) in `frontend/src/pages/ProductListPage.tsx` (depends on T025-T026)
- [x] T028 [P] [US1] Add baseline styling for list/cards/states in `frontend/src/styles/productList.css` and wire it into `frontend/src/pages/ProductListPage.tsx`

**Checkpoint**: User Story 1 is demoable as MVP.

---

## Phase 4: User Story 2 - Find products using search and/or filtering (Priority: P2)

**Goal**: A visitor can search by product name and filter by category.

**Independent Test**: With seeded data, verify:
- entering a search query narrows results
- selecting a category narrows results
- clearing inputs returns to full list of available products

### Tests for User Story 2

- [x] T029 [P] [US2] Backend integration test for name search (`q`) in `backend/src/test/java/com/specit/productlist/api/ProductsApiIT.java`
- [x] T030 [P] [US2] Backend integration test for category filter (`categoryId`) in `backend/src/test/java/com/specit/productlist/api/ProductsApiIT.java`
- [x] T031 [P] [US2] Frontend test for search/filter interactions and state reset in `frontend/src/pages/ProductListPage.test.tsx`

### Implementation for User Story 2

- [x] T032 [US2] Extend backend query logic for `q` and `categoryId` in `backend/src/main/java/com/specit/productlist/service/ProductService.java`
- [x] T033 [US2] Update controller validation for query params (`q`, `categoryId`) in `backend/src/main/java/com/specit/productlist/api/ProductsController.java`
- [x] T034 [P] [US2] Implement GET `/api/v1/categories` per contract in `backend/src/main/java/com/specit/productlist/api/CategoriesController.java`
- [x] T035 [P] [US2] Implement `getCategories` in `frontend/src/services/categoriesApi.ts`
- [x] T036 [P] [US2] Create search input component in `frontend/src/components/ProductSearchBar.tsx`
- [x] T037 [P] [US2] Create category filter component in `frontend/src/components/CategoryFilter.tsx`
- [x] T038 [US2] Wire search + filter into `frontend/src/pages/ProductListPage.tsx` (query params + clear/reset behavior)
- [x] T039 [P] [US2] Add CSS for search/filter controls in `frontend/src/styles/productFilters.css`

**Checkpoint**: US2 works and remains independently testable.

---

## Phase 5: User Story 3 - Sort and paginate the product list (Priority: P3)

**Goal**: A visitor can sort (name, price) and paginate through results while retaining current query state.

**Independent Test**: With enough seeded data:
- switch sort order and verify ordering changes
- navigate pages and verify state preserved and items change

### Tests for User Story 3

- [x] T040 [P] [US3] Backend integration test for sorting (`sort=name_asc`, `sort=price_asc`) in `backend/src/test/java/com/specit/productlist/api/ProductsApiIT.java`
- [x] T041 [P] [US3] Backend integration test for pagination (`page`, `pageSize`) in `backend/src/test/java/com/specit/productlist/api/ProductsApiIT.java`
- [x] T042 [P] [US3] Frontend test for sort + pagination state preservation in `frontend/src/pages/ProductListPage.test.tsx`

### Implementation for User Story 3

- [x] T043 [US3] Implement server-side pagination response shape (`items`, `page`, `pageSize`, `totalItems`, `totalPages`) in `backend/src/main/java/com/specit/productlist/service/ProductService.java`
- [x] T044 [US3] Update GET `/api/v1/products` response mapping to contract in `backend/src/main/java/com/specit/productlist/api/ProductsController.java`
- [x] T045 [P] [US3] Add sort control component in `frontend/src/components/SortSelect.tsx`
- [x] T046 [P] [US3] Add pagination component in `frontend/src/components/Pagination.tsx`
- [x] T047 [US3] Wire sort + pagination params into `frontend/src/pages/ProductListPage.tsx` and ensure they persist with search/filter
- [x] T048 [P] [US3] Add CSS for sorting/pagination controls in `frontend/src/styles/pagination.css`

**Checkpoint**: All user stories complete and independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Harden reliability, security defaults, and UX/a11y.

- [x] T049 [P] Add input validation for query params and consistent 400 error messages in `backend/src/main/java/com/specit/productlist/api/ProductsController.java`
- [x] T050 [P] Add database indexes in migration `backend/src/main/resources/db/migration/V1__init_schema.sql` aligned with query patterns
- [x] T051 Add API error `correlationId` propagation in responses in `backend/src/main/java/com/specit/productlist/api/ErrorHandler.java`
- [x] T052 [P] Improve accessibility: labels, keyboard navigation, focus states in `frontend/src/pages/ProductListPage.tsx` and CSS files under `frontend/src/styles/`
- [x] T053 Run through `specs/001-product-list/quickstart.md` smoke test and update the doc with any missing repo-specific commands

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)** → blocks Phase 2+
- **Phase 2 (Foundational)** → blocks all user stories
- **Phase 3 (US1)** is MVP and should be delivered first
- **Phase 4 (US2)** and **Phase 5 (US3)** build on the same endpoint but are still independently testable increments
- **Phase 6 (Polish)** after desired user stories

### Parallel Opportunities

- Within Phase 1: T004-T007 can run in parallel after T001-T003.
- Within Phase 2: T010-T012 and T014-T015 can run in parallel after T008-T009.
- Within each story: frontend component tasks and backend tasks can be split across developers where marked [P].

## Suggested MVP Scope

- Implement through **Phase 3 (US1)** only, then demo/validate before moving to US2/US3.
