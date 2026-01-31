# Specit POC Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### I. API-First Contracts (NON-NEGOTIABLE)
<!-- Example: I. Library-First -->
Every backend capability must be expressed as an explicit, versioned contract before implementation.
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### II. Reliability via Automated Testing (NON-NEGOTIABLE)
<!-- Example: II. CLI Interface -->
All changes must be covered by automated tests appropriate to the layer: unit tests for business logic, integration tests for persistence and HTTP boundaries, and UI tests for critical flows.
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### III. Security & Privacy by Default (NON-NEGOTIABLE)
<!-- Example: III. Test-First (NON-NEGOTIABLE) -->
Security is implemented proactively: validate inputs at boundaries, use least-privilege access, store secrets outside source control, and ensure safe defaults for authentication/authorization.
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### IV. Database Discipline (PostgreSQL) (NON-NEGOTIABLE)
<!-- Example: IV. Integration Testing -->
Schema changes are managed via migrations, are backward-compatible when possible, and are reviewed with query plans/performance impact in mind.
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### V. Observability & Operability (NON-NEGOTIABLE)
<!-- Example: V. Observability, VI. Versioning & Breaking Changes, VII. Simplicity -->
Production behavior must be diagnosable: structured logs with correlation IDs, actionable error responses, and health checks/metrics suitable for alerting.
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

## Technology Constraints (Java / React / PostgreSQL)
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

- **Backend (Java)**
  - **Architecture**: Controller → Service → Repository separation; business rules live in services/domain, not controllers.
  - **Validation**: Validate at HTTP boundary and again at domain invariants where needed.
  - **Error handling**: No raw stack traces to clients; return stable error shapes.
- **Frontend (React)**
  - **State**: Single source of truth per feature; avoid hidden shared mutable state.
  - **Accessibility**: New UI must meet baseline a11y (labels, keyboard navigation, focus management for dialogs).
  - **API usage**: Typed client contracts; no ad-hoc stringly-typed request building.
- **Database (PostgreSQL)**
  - **Migrations**: Every schema change has a migration and rollback strategy; migrations run in CI.
  - **Data integrity**: Prefer constraints (FK/unique/check) over “best effort” code checks.
  - **Performance**: New non-trivial queries require indexes and an explain plan review when feasible.
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## Development Workflow & Quality Gates
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

- **Branch/PR discipline**: Small PRs with clear scope; include screenshots for UI changes.
- **Code review**: At least one reviewer; reviewers must verify tests, security impact, and migration safety.
- **CI gates**: Build, lint/format, unit tests, and integration tests must pass before merge.
- **No broken main**: Main branch must always be deployable; use feature flags for incomplete work.
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

- This constitution is **non-negotiable** and supersedes local preferences.
- Any exception requires explicit documentation in the PR, rationale, and a time-bound follow-up task to remove the exception.
- Any amendment requires a written proposal, team approval, and (if applicable) a migration plan.
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: 1.0.0 | **Ratified**: 2026-01-28 | **Last Amended**: 2026-01-28
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
