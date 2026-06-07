# Technical Assessment Answers – Junior Test Automation Engineer

## SECTION 1 – API TESTING

### Question 1 – Part A (10 marks) – POST /users test cases

| Test Case ID | Description | Input / Request | Expected Response Code | Expected Response Body Assertion |
|--------------|--------------|----------------|------------------------|----------------------------------|
| TC-API-01 | Create user with valid data | `{"name":"John Doe","job":"QA Engineer"}` | 201 Created | `response.name = "John Doe"`, `response.job = "QA Engineer"`, `id` exists, `createdAt` not null |
| TC-API-02 | Create user with empty name | `{"name":"","job":"QA Engineer"}` | 400 / 422 | Error message: name is required |
| TC-API-03 | Create user with missing job field | `{"name":"John Doe"}` | 201 (if optional) or 400 | If 201, `job` may be null; else error message |
| TC-API-04 | Create user with extra fields | `{"name":"John Doe","job":"QA Engineer","extra":"field"}` | 201 Created | Extra field ignored; only name and job returned |

### Question 1 – Part B (8 marks)

**(i) 4 assertions for GET /users/2 response**

1. Response status code = `200 OK`.
2. `response.data.id` equals `2`.
3. `response.data.email` contains `@` (valid email format).
4. `response.support.url` is a valid HTTPS URL and not empty.

**(ii) GET /users/999 (non-existent user)**

- **HTTP status code:** `404 Not Found`
- **Why:** Resource with ID 999 does not exist. RESTful APIs return 404 when an item cannot be found.

### Question 1 – Part C (7 marks) – Edge cases / negative scenarios

| Edge Case / Negative Scenario | Expected Behaviour |
|------------------------------|--------------------|
| User ID 0 | `GET /users/0` → `404 Not Found` (IDs start at 1) |
| Invalid job type (number) | `400 Bad Request` – job expects a string |
| Missing name field | `400` / `422` – name required |
| Extremely long name (1000 chars) | `413 Payload Too Large` or `400` validation error |
| SQL injection / special chars | Sanitized; `201` (safe) or `400` reject |
| Empty JSON body `{}` | `400 Bad Request` – missing fields |

---

## SECTION 2 – SELENIUM WITH JAVASCRIPT

### Question 2 – Part A (15 marks) – Valid login script

See `selenium-tests/valid-login-test.js` in the repository.

### Question 2 – Part B (i) – Negative login test

See `selenium-tests/invalid-login-test.js` in the repository.

### Question 2 – Part B (ii) – Waits & locators

- **Implicit wait** – Tells WebDriver to poll the DOM for a fixed time when locating an element.  
  *Example:* `driver.manage().setTimeouts({implicit: 5000})` – use when elements appear predictably.
- **Explicit wait** – Waits for a specific condition on a specific element.  
  *Example:* `driver.wait(until.elementLocated(By.id('dynamic')), 10000)` – use for AJAX/dynamic content.
- **Preferred locator strategy:** **ID** (fastest, most reliable). If no unique ID, use **CSS Selector** (readable). XPath only when necessary (e.g., traversing up the DOM).

---

## SECTION 3 – TEST TECHNIQUES

### Question 3 – Equivalence Partitioning & Boundary Value Analysis (10 marks)

**(i) Equivalence partitions for Order Total**

| Partition Type | Range / Condition | Representative Test Value |
|----------------|-------------------|----------------------------|
| Valid – Low | Below R100 (no discount) | R50 |
| Valid – Medium 1 | R100 – R499.99 (5% discount) | R250 |
| Valid – Medium 2 | R500 – R999.99 (10% discount + free shipping) | R750 |
| Valid – High | R1000 and above (15% discount + free shipping) | R1500 |
| Invalid – Negative numbers | Any negative amount | -R20 |
| Invalid – Non‑numeric | e.g., alphabetic, special chars | "abc" |

**(ii) Boundary Value Analysis**

| Boundary | Test Value | Expected Outcome |
|----------|------------|------------------|
| Exactly R99.99 | R99.99 | No discount, no free shipping |
| Minimum of R100 | R100 | 5% discount, no free shipping |
| R99.99 → R100 transition | R100 | 5% discount |
| Upper 5% band (R499.99) | R499.99 | 5% discount, no free shipping |
| Lower 10% band (R500) | R500 | 10% discount, free shipping |
| Upper 10% band (R999.99) | R999.99 | 10% discount, free shipping |
| Lower 15% band (R1000) | R1000 | 15% discount, free shipping |
| Negative value | -R0.01 | Invalid – reject order |
| Non‑numeric | "zero" | Invalid – reject order |

---

### Question 4 – Test Case Design & Defect Reporting (20 marks)

#### Part A – 6 Test Cases for Registration Form

| TC # | Test Case Title | Preconditions | Test Steps | Expected Result |
|------|----------------|----------------|-------------|------------------|
| TC-REG-001 | Positive registration | Registration page loaded | Fill all valid data (age ≥18) → Register | Success, no errors, user redirected |
| TC-REG-002 | Full name exceeds max length | Same | Enter 61 characters → Register | Inline error "Maximum 60 characters" |
| TC-REG-003 | Invalid email format | Same | Enter "user@domain" (missing .com) → Register | Error "Valid email required" |
| TC-REG-004 | Mobile number not starting with 0 | Same | Enter "7123456789" → Register | Error "Mobile must start with 0 and be 10 digits" |
| TC-REG-005 | Password & Confirm mismatch | Same | Password = "Pass@123", Confirm = "Pass@124" → Register | Error "Passwords do not match" |
| TC-REG-006 | Under 18 (exactly 17 years old) | Same | DOB = today minus 17 years → Register | Error "You must be at least 18 years old" |

#### Part B – Defect Report for Age 17 bug

| Field | Value |
|--------|-------|
| **Defect ID** | DEF-REG-007 |
| **Title / Summary** | Underage user (exactly 17 years old) can register without error |
| **Environment** | Android 13, Chrome 120, Banking App v2.3.1 |
| **Severity & Priority** | Severity: Major (legal/compliance violation); Priority: High |
| **Steps to Reproduce** | 1. Open registration form. 2. Fill valid data. 3. Set DOB to current date minus 17 years. 4. Click Register. |
| **Expected Result** | Error "You must be 18 or older", registration blocked |
| **Actual Result** | No error, registration proceeds successfully |
| **Attachments / Notes** | Screenshot of successful registration; backend logs show no age validation |

---

### Question 5 – Exploratory Testing Charter (10 marks)

**Charter Title:** Explore Payment Details validation, security, and UX

**Mission / Goal:**  
Identify critical defects in payment information handling, including card data validation, error messages, and unexpected user behaviours.

**What to test:**  
- Card number, expiry, CVV, name on card  
- Integration with payment gateway (simulated)  
- Error handling (partial or empty data)  
- Security: no sensitive data in URLs / logs  

**How to test:**  
- Boundary value analysis (CVV length, expiry month 01–12)  
- Negative testing (expired card, incorrect CVV)  
- Session‑based testing (refresh, back button during payment)  
- Tools: Browser DevTools (network throttling, console)

**Time budget:** 45 minutes

**Exploration notes / test ideas:**

1. **Card number validation** – try 15 digits, 17 digits, non‑numeric characters → inline error.
2. **Expiry date edge** – month `00`, month `13`, year `99`, year `0000` → graceful rejection.
3. **CVV** – enter 2 digits (fail for non‑Amex), enter 4 digits for non‑Amex → clear message.
4. **Session expiry** – start payment, wait 30 min (simulate), then submit → redirect or "session timed out".
5. **Back button after successful payment** – page shows "already paid" or prevents duplicate charge.
6. **Missing mandatory fields** – submit empty form → all fields show validation errors.
7. **Network interruption** – disconnect after submit → friendly error message, no data loss.
