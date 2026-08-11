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

- [ ] Unexpected exceptions return standardized ApiErrorResponse (500)
- [x] Internal errors do not expose stack traces or sensitive information.

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
- [ ] Salary income → Salário (currently classified as Outros)
- [ ] Investment transactions → Investimento (currently classified as Alimentação)

---

## Financial Analysis

- [ ] Verify healthy financial profile.
- [ ] Verify highly indebted financial profile.
- [ ] Verify recommendations change according to transaction history.
- [ ] Verify spending summary consistency.
- [ ] Verify financial profile consistency.
- [ ] Verify probability consistency.

### Observations and Possible Improvements

- [ ] Income transactions with description "Salário" are currently classified as "Outros", affecting the financial analysis.
- [ ] Verify whether "Investimento" transactions are being classified correctly, since they were not reflected in the spending summary.
- [ ] Transactions with description "Investimento" are currently classified as **Alimentação** instead of **Investimento**.

---

# 9. Automated Tests

- [ ] TransactionClassificationService
- [ ] FinancialProfileService
- [ ] FinancialAnalysisService
- [ ] UserService

---

# 10. Improvements

## Authentication

- [x] Implemented `CustomAuthenticationEntryPoint`.
- [x] Standardized authentication errors for protected endpoints.
- [x] Missing JWT now returns `401 Unauthorized` using `ApiErrorResponse`.
- [x] Invalid JWT now returns `401 Unauthorized` using `ApiErrorResponse`.

## Observations and Possible Improvements

- [ ] Verify the expected behavior when the analysis period includes future dates. Currently, the API returns **200 OK** if `data_inicial` is valid, even when `data_final` is in the future. Confirm whether this is the intended business rule.

# Test Result

Status:

- [ ] Passed
- [ ] Failed

Comments:

```
```



