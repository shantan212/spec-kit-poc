# Tasks: User Creation API

**Input**: Design documents from `/specs/002-user-creation/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Tests are included per constitution requirement "II. Reliability via Automated Testing"

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Backend: `backend/src/main/java/com/specit/productlist/`
- Tests: `backend/src/test/java/com/specit/productlist/`
- Frontend: `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency configuration

- [x] T001 Add spring-boot-starter-security dependency to backend/pom.xml for BCryptPasswordEncoder
- [x] T002 [P] Create UserStatus enum in backend/src/main/java/com/specit/productlist/model/UserStatus.java
- [x] T003 [P] Create EmailAlreadyExistsException in backend/src/main/java/com/specit/productlist/api/exception/EmailAlreadyExistsException.java

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema and core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create Flyway migration V2__create_users_table.sql in backend/src/main/resources/db/migration/
- [x] T005 [P] Create User JPA entity in backend/src/main/java/com/specit/productlist/model/User.java
- [x] T006 [P] Create UserRepository interface in backend/src/main/java/com/specit/productlist/repository/UserRepository.java
- [x] T007 [P] Create ValidationError DTO in backend/src/main/java/com/specit/productlist/api/dto/ValidationErrorDto.java
- [x] T008 [P] Create ErrorResponse DTO in backend/src/main/java/com/specit/productlist/api/dto/ErrorResponseDto.java (if not exists)
- [x] T009 Configure BCryptPasswordEncoder bean in backend/src/main/java/com/specit/productlist/infra/SecurityConfig.java

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create New User Account (Priority: P1) 🎯 MVP

**Goal**: Enable client applications to create new user accounts via POST /api/v1/users endpoint

**Independent Test**: Send POST request with valid user data (email, password, name) and verify 201 response with user ID

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T010 [P] [US1] Create UsersControllerIT integration test class in backend/src/test/java/com/specit/productlist/api/UsersControllerIT.java
- [x] T011 [P] [US1] Add test: createUser_withValidData_returns201 in UsersControllerIT.java
- [x] T012 [P] [US1] Add test: createUser_withDuplicateEmail_returns409 in UsersControllerIT.java
- [x] T013 [P] [US1] Add test: createUser_withMissingFields_returns400 in UsersControllerIT.java

### Implementation for User Story 1

- [x] T014 [P] [US1] Create CreateUserRequestDto record in backend/src/main/java/com/specit/productlist/api/dto/CreateUserRequestDto.java
- [x] T015 [P] [US1] Create UserResponseDto record in backend/src/main/java/com/specit/productlist/api/dto/UserResponseDto.java
- [x] T016 [US1] Create UserService class in backend/src/main/java/com/specit/productlist/service/UserService.java with createUser method
- [x] T017 [US1] Create UsersController class in backend/src/main/java/com/specit/productlist/api/UsersController.java with POST endpoint
- [x] T018 [US1] Add global exception handler for EmailAlreadyExistsException in backend/src/main/java/com/specit/productlist/api/GlobalExceptionHandler.java
- [x] T019 [US1] Add existsByEmail method to UserRepository for duplicate check

**Checkpoint**: User Story 1 complete - can create users with valid data, get 409 for duplicates, 400 for missing fields

---

## Phase 4: User Story 2 - Validate User Input (Priority: P1)

**Goal**: Validate email format, password complexity, and name length before account creation

**Independent Test**: Submit invalid inputs (bad email, weak password, long name) and verify 400 responses with specific error details

### Tests for User Story 2

- [x] T020 [P] [US2] Add test: createUser_withInvalidEmail_returns400 in UsersControllerIT.java
- [x] T021 [P] [US2] Add test: createUser_withWeakPassword_returns400 in UsersControllerIT.java
- [x] T022 [P] [US2] Add test: createUser_withNameTooLong_returns400 in UsersControllerIT.java

### Implementation for User Story 2

- [x] T023 [P] [US2] Create ValidPassword annotation in backend/src/main/java/com/specit/productlist/api/validation/ValidPassword.java
- [x] T024 [P] [US2] Create PasswordValidator class in backend/src/main/java/com/specit/productlist/api/validation/PasswordValidator.java
- [x] T025 [US2] Add @Email, @Size, @Pattern validations to CreateUserRequestDto fields
- [x] T026 [US2] Update GlobalExceptionHandler to return detailed validation errors with field names

**Checkpoint**: User Story 2 complete - all input validation working with specific error messages

---

## Phase 5: User Story 3 - Secure Password Storage (Priority: P1)

**Goal**: Hash passwords using BCrypt before storage, ensuring unique salts per user

**Independent Test**: Create user, query database directly, verify password_hash is BCrypt format (not plain text)

### Tests for User Story 3

- [x] T027 [P] [US3] Create UserServiceTest unit test class in backend/src/test/java/com/specit/productlist/service/UserServiceTest.java
- [x] T028 [P] [US3] Add test: createUser_hashesPasswordWithBCrypt in UserServiceTest.java
- [x] T029 [P] [US3] Add test: createUser_samePasswordDifferentHashes in UserServiceTest.java
- [x] T030 [P] [US3] Add test: userResponse_doesNotContainPassword in UserServiceTest.java

### Implementation for User Story 3

- [x] T031 [US3] Inject BCryptPasswordEncoder into UserService
- [x] T032 [US3] Update UserService.createUser to hash password before saving
- [x] T033 [US3] Verify UserResponseDto excludes password and passwordHash fields

**Checkpoint**: User Story 3 complete - passwords securely hashed with unique salts

---

## Phase 6: Frontend Integration

**Purpose**: TypeScript API client for user creation

- [x] T034 [P] Run OpenAPI codegen to generate TypeScript types in frontend/src/services/generated/
- [x] T035 Create usersApi.ts client in frontend/src/services/usersApi.ts with createUser function
- [x] T036 Add error handling for 400/409 responses in usersApi.ts

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T037 [P] Add correlation ID to error responses via MDC in GlobalExceptionHandler
- [x] T038 [P] Add structured logging for user creation events in UserService
- [x] T039 Run contract validation: npx @redocly/cli lint specs/002-user-creation/contracts/openapi.yaml
- [x] T040 Run quickstart.md validation - test all curl examples
- [x] T041 Update docs/openapi.yaml with user creation endpoint (if consolidated spec exists)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 → US2 → US3 (sequential, as validation and hashing build on core creation)
- **Frontend (Phase 6)**: Can start after Phase 3 (US1) is complete
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Core creation flow
- **User Story 2 (P1)**: Depends on US1 - Adds validation to existing DTOs
- **User Story 3 (P1)**: Depends on US1 - Adds password hashing to existing service

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- DTOs before services
- Services before controllers
- Core implementation before error handling
- Story complete before moving to next

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T002 (UserStatus enum) || T003 (Exception class)
```

**Phase 2 (Foundational)**:
```
T005 (User entity) || T006 (Repository) || T007 (ValidationError) || T008 (ErrorResponse)
```

**Phase 3 (US1 Tests)**:
```
T010 || T011 || T012 || T013 (all test methods)
```

**Phase 3 (US1 Implementation)**:
```
T014 (Request DTO) || T015 (Response DTO)
```

**Phase 4 (US2)**:
```
T020 || T021 || T022 (tests)
T023 (annotation) || T024 (validator)
```

**Phase 5 (US3)**:
```
T027 || T028 || T029 || T030 (tests)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T009)
3. Complete Phase 3: User Story 1 (T010-T019)
4. **STOP and VALIDATE**: Test with curl - create user, verify 201/409/400 responses
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **MVP Ready!**
3. Add User Story 2 → Validation working → Deploy/Demo
4. Add User Story 3 → Security complete → Deploy/Demo
5. Add Frontend → Full stack ready
6. Polish → Production ready

### Suggested Execution

For single developer:
```
Day 1: T001-T009 (Setup + Foundational)
Day 2: T010-T019 (US1 - Core creation)
Day 3: T020-T026 (US2 - Validation)
Day 4: T027-T033 (US3 - Password hashing)
Day 5: T034-T041 (Frontend + Polish)
```

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All 3 user stories are P1 priority but have logical dependencies (validation and hashing build on core creation)
