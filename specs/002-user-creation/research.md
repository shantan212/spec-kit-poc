# Research: User Creation API

**Feature**: 002-user-creation  
**Date**: 2026-02-02  
**Status**: Complete

## Overview

This document consolidates research findings for implementing the User Creation API endpoint. All technical decisions are aligned with the project's existing technology stack and constitution.

---

## Research Topics

### 1. Password Hashing Algorithm

**Decision**: BCrypt with cost factor 12

**Rationale**:
- BCrypt is the industry standard for password hashing in Java/Spring applications
- Spring Security provides built-in `BCryptPasswordEncoder`
- Cost factor 12 provides good security/performance balance (~250ms hash time)
- Automatically handles salt generation and storage

**Alternatives Considered**:
| Algorithm | Rejected Because |
|-----------|------------------|
| Argon2 | Not natively supported in Spring Security; requires additional dependencies |
| PBKDF2 | Less resistant to GPU attacks compared to BCrypt |
| SHA-256 | Not designed for password hashing; too fast, vulnerable to brute force |
| SCrypt | Higher memory requirements; BCrypt is sufficient for this use case |

**Implementation**:
```java
// Add to pom.xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

// Usage
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
String hash = encoder.encode(rawPassword);
```

---

### 2. Email Validation Strategy

**Decision**: Jakarta Bean Validation (`@Email`) + custom regex for stricter validation

**Rationale**:
- `@Email` annotation provides basic RFC 5322 compliance
- Additional regex pattern ensures practical email formats (no IP addresses, requires TLD)
- Validation occurs at DTO level (HTTP boundary) per constitution

**Alternatives Considered**:
| Approach | Rejected Because |
|----------|------------------|
| Simple regex only | May miss edge cases; reinventing the wheel |
| External validation service | Adds latency and external dependency |
| Database-only validation | Violates "validate at boundary" principle |

**Implementation**:
```java
@Email(message = "Invalid email format")
@Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", 
         message = "Email must have valid domain")
private String email;
```

---

### 3. Password Complexity Validation

**Decision**: Custom validator annotation with configurable rules

**Rationale**:
- Spec requires: minimum 8 chars, 1 uppercase, 1 lowercase, 1 digit
- Custom annotation provides clear error messages per rule
- Reusable across other endpoints if needed

**Alternatives Considered**:
| Approach | Rejected Because |
|----------|------------------|
| Single regex | Poor error messages; user doesn't know which rule failed |
| Passay library | Additional dependency for simple requirements |
| Service-layer validation | Violates "validate at boundary" principle |

**Implementation**:
```java
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordValidator.class)
public @interface ValidPassword {
    String message() default "Password does not meet requirements";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

---

### 4. Unique Email Constraint Handling

**Decision**: Database unique constraint + application-level pre-check

**Rationale**:
- Database constraint ensures data integrity (constitution requirement)
- Application pre-check provides better error messages
- Handles race conditions gracefully via exception handling

**Alternatives Considered**:
| Approach | Rejected Because |
|----------|------------------|
| Application-only check | Race condition vulnerability |
| Database-only constraint | Generic SQL exception; poor UX |
| Distributed lock | Over-engineering for this use case |

**Implementation**:
```sql
-- Migration
ALTER TABLE users ADD CONSTRAINT uk_users_email UNIQUE (email);
```

```java
// Service layer
if (userRepository.existsByEmail(email)) {
    throw new EmailAlreadyExistsException(email);
}
// Still handle DataIntegrityViolationException for race conditions
```

---

### 5. User ID Generation Strategy

**Decision**: UUID v4 (random)

**Rationale**:
- Consistent with existing Product entity pattern
- No sequential information leakage
- Works well with distributed systems
- PostgreSQL has native UUID type

**Alternatives Considered**:
| Approach | Rejected Because |
|----------|------------------|
| Auto-increment | Exposes user count; predictable |
| UUID v1 | Contains timestamp/MAC; privacy concern |
| Snowflake ID | Over-engineering; no distributed requirement |

**Implementation**:
```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
private UUID id;
```

---

### 6. Error Response Format

**Decision**: Reuse existing `ErrorResponse` schema from product-list API

**Rationale**:
- Consistency across API endpoints
- Already defined in OpenAPI contract
- Includes correlation ID for observability

**Implementation**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "correlationId": "abc-123",
    "details": [
      {"field": "email", "message": "Invalid email format"},
      {"field": "password", "message": "Must contain at least one digit"}
    ]
  }
}
```

---

## Dependencies to Add

| Dependency | Purpose | Version |
|------------|---------|---------|
| spring-boot-starter-security | BCrypt password encoder | (managed by parent) |

**Note**: No new major dependencies required. Spring Security is added only for `BCryptPasswordEncoder`; full security configuration is out of scope for this feature.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| BCrypt performance under load | Cost factor 12 tested at ~250ms; acceptable for user creation |
| Email uniqueness race condition | Database constraint as final safeguard |
| Password complexity too strict | Requirements match industry standards; can be relaxed later |

---

## References

- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Spring Security BCrypt Documentation](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)
- [RFC 5322 - Email Format](https://datatracker.ietf.org/doc/html/rfc5322)
