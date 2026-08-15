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

- [x] Generate financial analysis (200)
- [x] Reject future period (422)
- [x] Reject period without transactions (400)
- [x] Reject period with less than three transactions (422)

---

## History

- [x] List analyses (200)
- [x] Get analysis by id (200)
- [x] Reject nonexistent analysis (404)
- [x] Reject analysis from another user (404)

---

## Delete

- [x] Delete analysis (204)
- [x] Reject nonexistent analysis (404)
- [x] Reject delete from another user (404)
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
- [x] User A cannot access User B analyses (404)
- [x] User A cannot delete User B resources (404)
- [x] User A cannot update User B resources (404)

---

# 6. Error Handling

## Validation

- [x] Reject invalid request body (400)
- [x] Reject missing required fields (400)
- [x] Reject invalid field values (400)
- [x] Validation errors follow ApiErrorResponse format.

---

## Authentication

- [x] Missing JWT returns 401.
- [x] Invalid JWT returns 401.
- [x] Expired JWT returns 401.

---

## Resource Not Found

- [x] Transaction not found (404)
- [x] Financial analysis not found (404)
- [x] User not found (404)

---

## Business Rules

- [x] Reject duplicate email (409)
- [x] Reject update of transactions older than 30 days (422)
- [x] Reject deletion of transactions older than 30 days (422)
- [x] Reject financial analysis for future periods (422)
- [x] Reject financial analysis with fewer than three transactions (422)

---

## Unexpected Errors

- Internal errors do not expose stack traces or sensitive information.
- Unexpected exception standardization was partially validated.
- Invalid transaction type currently returns `500 Internal Server Error` instead of the expected `400 Bad Request`.
- This behavior was documented as a known issue for future correction.

---

# 7. Integration

## Backend + ML

- [x] Transaction classification.
- [x] Financial analysis.
- [x] Fallback execution.

---

## Backend + Frontend

- [ ] Login.
- [ ] Dashboard.
- [ ] Transactions.
- [ ] Financial analysis.

### Observation

- Frontend integration tests are pending because the frontend integration is still in progress.
- Backend endpoints were validated independently through manual API tests, Docker deployment validation and automated unit tests.

---

# 8. Machine Learning Validation

The following tests validate the quality and consistency of the Machine Learning models used for transaction classification and financial analysis. Unlike API integration tests, these scenarios focus on verifying whether the predictions and recommendations are coherent with the provided financial data.

## Transaction Classification

- [x] McDonald's → Alimentação
- [x] Drogasil → Saúde
- [x] Uber → Trajeto
- [x] Mercado Livre → Compras
- [x] Steam → Entretenimento
- [x] Unknown descriptions → Outros
- [x] Generic salary descriptions are classified correctly.
- [x] Generic investment descriptions are classified correctly.

---

## Financial Analysis

- [x] Verify healthy financial profile.
- [x] Verify highly indebted financial profile.
- [x] Verify recommendations change according to transaction history.
- [x] Verify spending summary consistency.
- [x] Verify financial profile consistency.
- [x] Verify probability consistency.

### Observations and Possible Improvements

- [x] Income transactions with description "Salário" were validated in the spending summary.
- [x] Investment transactions were validated in the spending summary.
- [x] The 35% threshold rule correctly identified dominant spending categories.
- Observation: the 35% rule may generate recommendations even for healthy profiles with low total expenses, because one category can dominate when there are few transactions.
- Observation: "Mercado Extra" was classified as "Compras" instead of "Alimentação", which may require future ML/category rule review.

### Fixed Issues

- [x] Fixed backend enum to support "Nenhuma" as a valid savings frequency returned by ML.
- [x] Revalidated "Salário" classification in the financial analysis summary.
- [x] Revalidated "Investimento" classification in the financial analysis summary.

---

# 9. Deployment Validation

- [x] Docker Compose
- [x] Backend container
- [x] ML container
- [x] Frontend container
- [x] Database container
- [x] End-to-end validation using Docker

---

# 10. Automated Tests

- [x] TransactionClassificationService
- [x] FinancialProfileService
- [x] FinancialAnalysisService
- [x] UserService

## Automated Test Result

- [x] 24 automated tests executed successfully.
- [x] 0 failures.
- [x] 0 errors.
- [x] 1 skipped test: `FinanceAiApiApplicationTests`, disabled because unit tests should not depend on the real database.

# 11. Improvements

## Authentication

- [x] Implemented `CustomAuthenticationEntryPoint`.
- [x] Standardized authentication errors for protected endpoints.
- [x] Missing JWT now returns `401 Unauthorized` using `ApiErrorResponse`.
- [x] Invalid JWT now returns `401 Unauthorized` using `ApiErrorResponse`.

## Observations and Possible Improvements

- [ ] Verify the expected behavior when the analysis period includes future dates. Currently, the API returns **200 OK** if `data_inicial` is valid, even when `data_final` is in the future. Confirm whether this is the intended business rule.

# 12. Known Issues

- Invalid transaction type currently returns `500 Internal Server Error` instead of `400 Bad Request`.
- The API currently returns `200 OK` when `data_inicial` is valid but `data_final` is in the future. This behavior should be confirmed as an intended business rule.
- The 35% recommendation threshold may generate recommendations for healthy profiles with low total expenses.
- "Mercado Extra" was classified as "Compras" instead of "Alimentação", which may require future ML/category rule review.

# Test Result

Status

- [x] Backend validation completed
- [ ] Frontend integration validation pending
- [ ] Failed

Comments:

```text
Backend validation completed successfully.

Manual API tests, Machine Learning validation, Docker deployment validation and automated unit tests were executed.

Automated tests:
- 24 tests executed
- 0 failures
- 0 errors
- 1 skipped context load test

Frontend integration tests are pending because the frontend integration is still in progress.

Known issues and improvement points were documented for future review.



