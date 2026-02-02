# Data Model: User Creation API

**Feature**: 002-user-creation  
**Date**: 2026-02-02  
**Status**: Complete

## Entities

### User

Represents a registered user in the system.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL, auto-generated | Unique identifier |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User's email address |
| `name` | VARCHAR(100) | NOT NULL | User's display name |
| `password_hash` | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| `status` | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | Account status |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes**:
- `pk_users` - Primary key on `id`
- `uk_users_email` - Unique index on `email`

**Status Values**:
- `ACTIVE` - User can authenticate and use the system
- `INACTIVE` - User account is disabled
- `PENDING` - Reserved for future email verification feature

---

## Relationships

```text
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │
│ email (UK)      │
│ name            │
│ password_hash   │
│ status          │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

**Note**: User entity is standalone for this feature. Future features may add relationships:
- User → Role (many-to-many) for authorization
- User → Session for authentication tracking

---

## Validation Rules

### Email
- Required (NOT NULL)
- Valid email format (RFC 5322 compliant)
- Maximum 255 characters
- Unique across all users
- Case-insensitive uniqueness (stored lowercase)

### Name
- Required (NOT NULL)
- Minimum 1 character
- Maximum 100 characters
- Allows Unicode characters (international names)
- Trimmed of leading/trailing whitespace

### Password (input, not stored)
- Required
- Minimum 8 characters
- Maximum 128 characters
- Must contain at least 1 uppercase letter
- Must contain at least 1 lowercase letter
- Must contain at least 1 digit

### Password Hash (stored)
- BCrypt hash with cost factor 12
- Always 60 characters (BCrypt standard)
- Never exposed in API responses

---

## State Transitions

```text
                    ┌──────────────┐
    User Created    │              │
   ───────────────► │    ACTIVE    │
                    │              │
                    └──────┬───────┘
                           │
                           │ Admin disables
                           ▼
                    ┌──────────────┐
                    │              │
                    │   INACTIVE   │
                    │              │
                    └──────┬───────┘
                           │
                           │ Admin re-enables
                           ▼
                    ┌──────────────┐
                    │              │
                    │    ACTIVE    │
                    │              │
                    └──────────────┘
```

**Note**: State transitions are out of scope for this feature (user creation only). Documented for future reference.

---

## Database Migration

**File**: `V2__create_users_table.sql`

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT ck_users_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING'))
);

CREATE INDEX idx_users_email ON users (LOWER(email));

COMMENT ON TABLE users IS 'Registered user accounts';
COMMENT ON COLUMN users.password_hash IS 'BCrypt hashed password - never expose in API';
```

---

## JPA Entity Mapping

```java
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status = UserStatus.ACTIVE;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}

public enum UserStatus {
    ACTIVE, INACTIVE, PENDING
}
```

---

## Data Transfer Objects

### CreateUserRequestDto (Input)

```java
public record CreateUserRequestDto(
    @NotBlank @Email @Size(max = 255)
    String email,
    
    @NotBlank @Size(min = 1, max = 100)
    String name,
    
    @NotBlank @ValidPassword
    String password
) {}
```

### UserResponseDto (Output)

```java
public record UserResponseDto(
    UUID id,
    String email,
    String name,
    String status,
    Instant createdAt
) {
    public static UserResponseDto from(User user) {
        return new UserResponseDto(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getStatus().name(),
            user.getCreatedAt()
        );
    }
}
```

**Note**: `password` and `passwordHash` are intentionally excluded from response DTO per FR-011.
