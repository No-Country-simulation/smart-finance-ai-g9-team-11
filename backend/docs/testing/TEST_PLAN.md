# FinanceAI - Backend Test Plan

## Objective

This document describes the test scenarios executed to validate the FinanceAI backend before deployment.

The goal is to verify:

- Functional correctness
- API consistency
- Security
- Error handling
- Integration between Backend, Frontend and Machine Learning

---

# 1. Authentication

## User Registration

- [x] Register a new user successfully (201)
- [x] Reject duplicated email (409)
- [x] Reject invalid email (400)
- [x] Reject weak password (400)
- [x] Reject missing name (400)
- [x] Reject missing email (400)
- [x] Reject missing password (400)
- [x] Reject blank name (400)

---

## Login

- [x] Login with valid credentials (200)
- [x] Reject invalid password (401)
- [x] Reject nonexistent email (401)

---

## JWT Authentication

- [x] Verify JWT generation (200)
- [x] Verify protected endpoint using JWT (200)
- [x] Reject requests without JWT (401)
- [x] Reject invalid JWT (401)
- [x] Reject expired JWT (401)

---

## Account Reactivation

- [x] Reactivate inactive account (204)
- [x] Reject invalid password (401)
- [x] Reject already active account (422)
- [x] Reject nonexistent account (404)

---

# 2. User

## Profile

- [x] Get authenticated user (200)
- [x] Update profile (200)
- [x] Update email (200)
- [x] Update password (200)
- [x] Reject duplicated email (409)
- [x] Reject invalid email (400)
- [x] Reject weak password (400)

---

## Account

- [x] Deactivate account (204)
- [x] Verify inactive user cannot login (401)

---

# 3. Transactions

## Create

- [x] Create one transaction (201)
- [x] Create multiple transactions (201)
- [x] Verify ML classification (201)
- [x] Verify fallback classification (201)

---

## Read

- [x] List transactions (200)
- [x] Get transaction by id (200)
- [x] Reject nonexistent transaction (404)
- [x] Reject access to another user's transaction (404)

---

## Update

- [x] Update transaction (200)
- [x] Verify ML reclassification after update (200)
- [x] Reject update for transactions older than 30 days (422)
- [x] Reject blank description (400)
- [x] Reject negative value (400)
- [x] Reject update from another user (404)
- [ ] Reject invalid transaction type (BUG: returns 500 instead of 400)

---

## Delete

- [x] Delete transaction (204)
- [x] Reject nonexistent transaction (404)
- [x] Reject delete from another user (404)
- [x] Reject delete for transactions older than 30 days (422)
- [x] Reject delete without authentication (401)

---

# 4. Financial Analysis

## Generate

- [ ] Generate financial analysis.
- [ ] Reject future period.
- [ ] Reject period without transactions.
- [ ] Reject period with less than three transactions.

---

## History

- [ ] List analyses.
- [ ] Get analysis by id.
- [ ] Delete analysis.

---

## Fallback

- [x] Verify analysis fallback when ML is unavailable.

---

# 5. Security

## Authentication

- [x] Access protected endpoint without JWT.
- [x] Access protected endpoint with invalid JWT.
- [x] Access protected endpoint with expired JWT (401)

---

## Authorization

- [x] User A cannot access User B transactions (404)
- [ ] User A cannot access User B analyses.
- [x] User A cannot delete User B resources (404)
- [x] User A cannot update User B resources (404)

---

# 6. Error Handling

- [ ] Invalid request returns correct HTTP status.
- [ ] Validation errors follow ApiErrorResponse.
- [ ] Resource not found returns 404.
- [ ] Business errors return expected status.
- [ ] Unexpected errors return standardized response.

---

# 7. Integration

## Backend + ML

- [ ] Transaction classification.
- [ ] Financial analysis.
- [ ] Fallback execution.

---

## Backend + Frontend

- [ ] Login.
- [ ] Dashboard.
- [ ] Transactions.
- [ ] Financial analysis.

---

# 8. Automated Tests

- [ ] TransactionClassificationService
- [ ] FinancialProfileService
- [ ] FinancialAnalysisService
- [ ] UserService

---

# 9. Improvements

## Authentication

- [x] Implemented `CustomAuthenticationEntryPoint`.
- [x] Standardized authentication errors for protected endpoints.
- [x] Missing JWT now returns `401 Unauthorized` using `ApiErrorResponse`.
- [x] Invalid JWT now returns `401 Unauthorized` using `ApiErrorResponse`.

# Test Result

Status:

- [ ] Passed
- [ ] Failed

Comments:

```
```



