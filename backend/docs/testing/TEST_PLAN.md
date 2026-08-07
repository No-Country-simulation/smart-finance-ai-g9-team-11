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
- [x] Reject missing required fields (400)

---

## Login

- [x] Login with valid credentials (200)
- [x] Reject invalid password (401)
- [x] Reject nonexistent email (401)
- [x] Verify JWT generation.
- [x] Verify protected endpoint using JWT.
- [x] Reject requests without JWT (401)
- [x] Reject invalid JWT (401)

---

## Account Reactivation

- [x] Reactivate inactive account (204)
- [x] Reject invalid password (401)
- [x] Reject already active account (422)
- [x] Reject nonexistent account (404)

---

# 2. User

## Profile

- [ ] Get authenticated user.
- [ ] Update profile.
- [ ] Update password.
- [ ] Update email.
- [ ] Reject duplicated email.

---

## Account

- [x] Deactivate account (204)
- [x] Verify inactive user cannot login (401)

---

# 3. Transactions

## Create

- [ ] Create one transaction.
- [ ] Create multiple transactions.
- [ ] Verify ML classification.
- [ ] Verify fallback classification.

---

## Read

- [ ] List transactions.
- [ ] Get transaction by id.

---

## Update

- [ ] Update transaction.

---

## Delete

- [ ] Delete transaction.

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

- [ ] Verify analysis fallback when ML is unavailable.

---

# 5. Security

## Authentication

- [x] Access protected endpoint without JWT.
- [x] Access protected endpoint with invalid JWT.
- [ ] Access protected endpoint with expired JWT (if applicable).

---

## Authorization

- [ ] User A cannot access User B transactions.
- [ ] User A cannot access User B analyses.
- [ ] User A cannot delete User B resources.
- [ ] User A cannot update User B resources.

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



