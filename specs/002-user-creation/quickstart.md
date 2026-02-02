# Quickstart: User Creation API

**Feature**: 002-user-creation  
**Date**: 2026-02-02

## Overview

This guide helps developers quickly implement and test the User Creation API endpoint.

---

## Prerequisites

- Java 17+
- Maven 3.8+
- PostgreSQL 14+ (or Docker for Testcontainers)
- Node.js 20+ (for frontend)

---

## Backend Setup

### 1. Add Spring Security Dependency

Add to `backend/pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

### 2. Run Database Migration

The migration `V2__create_users_table.sql` will run automatically on startup.

### 3. Build and Run

```bash
cd backend
mvn spring-boot:run
```

---

## API Usage

### Create User

**Request**:
```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "name": "John Doe",
    "password": "SecurePass123"
  }'
```

**Success Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "name": "John Doe",
  "status": "ACTIVE",
  "createdAt": "2026-02-02T12:00:00Z"
}
```

**Validation Error** (400 Bad Request):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "correlationId": "abc-123",
    "details": [
      {"field": "password", "message": "Password must contain at least one digit"}
    ]
  }
}
```

**Duplicate Email** (409 Conflict):
```json
{
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "A user with this email address already exists",
    "correlationId": "abc-123"
  }
}
```

---

## Password Requirements

| Requirement | Example Pass | Example Fail |
|-------------|--------------|--------------|
| Min 8 characters | `Password1` | `Pass1` |
| 1 uppercase | `Password1` | `password1` |
| 1 lowercase | `Password1` | `PASSWORD1` |
| 1 digit | `Password1` | `Password` |

---

## Testing

### Run Unit Tests

```bash
cd backend
mvn test -Dtest=UserServiceTest
```

### Run Integration Tests

```bash
cd backend
mvn test -Dtest=UsersControllerIT
```

**Note**: Integration tests use Testcontainers to spin up a PostgreSQL instance automatically.

---

## Frontend Integration

### Generate TypeScript Types

```bash
cd frontend
npm run codegen
```

### Use the API Client

```typescript
import { createUser } from './services/usersApi';

const newUser = await createUser({
  email: 'john.doe@example.com',
  name: 'John Doe',
  password: 'SecurePass123'
});

console.log('Created user:', newUser.id);
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `409 Conflict` on create | Email already exists; use different email |
| `400 Bad Request` | Check password meets all complexity requirements |
| Database connection error | Ensure PostgreSQL is running on port 5432 |
| BCrypt slow on first request | Normal; BCrypt cost factor 12 takes ~250ms |

---

## Related Files

| File | Purpose |
|------|---------|
| `specs/002-user-creation/contracts/openapi.yaml` | API contract |
| `specs/002-user-creation/data-model.md` | Entity definitions |
| `backend/src/main/resources/db/migration/V2__create_users_table.sql` | Database schema |

---

## Next Steps

After implementing this feature:

1. Run `/speckit.tasks` to generate implementation tasks
2. Implement backend components (Controller → Service → Repository)
3. Add frontend API client
4. Run contract validation workflow
