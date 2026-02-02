# spec-kit-poc

A Proof of Concept project demonstrating **SpecKit** - a specification-driven development workflow for building features systematically.

## Overview

This project implements a **Product Listing** feature using SpecKit workflows to plan, specify, and implement functionality in a structured manner.

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.2
- **Language**: Java 17
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA + Hibernate
- **Migrations**: Flyway
- **Testing**: JUnit 5 + Testcontainers
- **Build**: Maven

### Frontend
- **Framework**: React 18.2
- **Language**: TypeScript 5.3
- **Build Tool**: Vite 5.0
- **Testing**: Vitest + React Testing Library

## Project Structure

```
spec-kit-poc/
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/          # Java source code
│   ├── src/main/resources/     # Configuration & migrations
│   └── pom.xml                 # Maven dependencies
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API client & services
│   │   └── styles/             # CSS styles
│   └── package.json
├── specs/                      # Feature specifications
│   └── 001-product-list/       # Product listing feature
│       ├── spec.md             # Feature specification
│       ├── plan.md             # Implementation plan
│       ├── tasks.md            # Task breakdown
│       ├── data-model.md       # Data model documentation
│       ├── contracts/          # OpenAPI contracts
│       └── checklists/         # Quality checklists
└── .windsurf/
    └── workflows/              # SpecKit workflow definitions
```

## API Documentation

📖 **Live Documentation** (after GitHub Pages deployment):
- **Swagger UI** (Interactive): `https://<username>.github.io/<repo>/swagger.html`
- **ReDoc** (Professional): `https://<username>.github.io/<repo>/redoc.html`

To view locally, open `docs/index.html` in your browser.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/products` | GET | List available products |
| `/api/v1/categories` | GET | List categories |
| `/actuator/health` | GET | Health check |

### Query Parameters for `/api/v1/products`

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search by product name (case-insensitive) |
| `categoryId` | UUID | Filter by category |
| `sort` | string | Sort order: `name_asc`, `price_asc` |
| `page` | int | Page number (1-based, default: 1) |
| `pageSize` | int | Items per page (default: 20, max: 200) |

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Maven 3.8+

### Database Setup

```sql
CREATE DATABASE product_list;
CREATE USER edscoreapp WITH PASSWORD 'dba';
GRANT ALL PRIVILEGES ON DATABASE product_list TO edscoreapp;
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:5173`

## Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## SpecKit Workflows

This project uses SpecKit workflows for specification-driven development:

| Command | Description |
|---------|-------------|
| `/speckit.specify` | Create/update feature specifications |
| `/speckit.plan` | Generate implementation plans |
| `/speckit.tasks` | Generate actionable task lists |
| `/speckit.implement` | Execute implementation tasks |
| `/speckit.clarify` | Ask clarification questions |
| `/speckit.analyze` | Cross-artifact consistency analysis |

## Feature Status: Product Listing

| User Story | Priority | Status |
|------------|----------|--------|
| View all available products | P1 (MVP) | ✅ Implemented |
| Search and filter products | P2 | ⏳ Pending |
| Sort and paginate | P3 | ⏳ Pending |

## License

This project is for demonstration purposes.
