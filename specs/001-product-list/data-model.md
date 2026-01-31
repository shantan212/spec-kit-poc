# Data Model: Product Listing (Available Products)

**Date**: 2026-01-28  
**Feature**: ./spec.md

## Overview

The system stores products and categories. The product listing endpoint queries only products marked as available and supports optional search/filter/sort/pagination.

## Entities

### Category

**Purpose**: Group products for filtering.

**Fields**:
- `id` (primary key)
- `name` (display name; unique)
- `created_at`
- `updated_at`

**Constraints**:
- `name` must be non-empty
- `name` must be unique (case-sensitive uniqueness is acceptable unless specified otherwise)

### Product

**Purpose**: Item displayed in product list.

**Fields**:
- `id` (primary key)
- `name` (required)
- `description_summary` (optional)
- `image_url` (optional)
- `price_amount` (optional)
- `price_currency` (optional; required if `price_amount` present)
- `is_available` (required)
- `category_id` (foreign key → Category; optional or required depending on business rules; default: optional)
- `created_at`
- `updated_at`

**Constraints**:
- `name` must be non-empty
- `is_available` must be present
- If `price_amount` is present then:
  - `price_amount` must be >= 0
  - `price_currency` must be present

## Relationships

- Category `1 -> many` Products
- Product `many -> 0..1` Category (assumption: category optional; adjust to required if desired)

## Query Patterns

### Product listing
Filter conditions:
- Always filter: `is_available = true`
- Optional filter: `category_id = :categoryId`
- Optional search: name contains search term (case-insensitive)

Sorting:
- `name` ascending
- `price_amount` ascending (nulls last)

Pagination:
- page number + page size

## Indexing Recommendations (PostgreSQL)

- Index on `(is_available)`
- Composite index on `(is_available, category_id)` for category filtering
- For name search, consider a case-insensitive search strategy; for scale, consider a dedicated index suitable for substring search.

## Migration Strategy

- Use versioned migrations for creating tables and indexes.
- Keep migrations backward-compatible when possible.
- Provide rollback strategy per migration (where feasible).
