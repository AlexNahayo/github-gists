# GitHub Gists API Automation

## Tech Stack

- Playwright API Testing
- JavaScript
- GitHub REST API
- AJV JSON Schema Validation
- GitHub Actions

---

## Setup

Install dependencies:

```bash
npm install
```

Create `.env`:

```text
GITHUB_TOKEN=<token>
BASE_URL=https://api.github.com
```

---

## Running Tests

```bash
npx playwright test
```

---

# GitHub Gists API Tests

This test suite validates the core CRUD functionality of the GitHub Gists REST API using Playwright API testing.

The focus is on validating:

- Core API workflows
- Authentication scenarios
- Negative testing scenarios
- Request and response validation
- API caching behaviour
- Automated test data cleanup

---

## Coverage

### Create Gist (`POST /gists`)

- Create private gist (`201 Created`)
- Create public gist (`201 Created`)
- Create gist with multiple file types (`201 Created`)
- Reject unauthenticated requests (`401 Unauthorized`)
- Reject invalid request payloads (`422 Unprocessable Entity`)

---

### Retrieve Gists (`GET /gists`)

- Retrieve authenticated user's gists (`200 OK`)
- Validate response schema
- Validate common response headers
- Validate ETag caching using `If-None-Match` (`304 Not Modified`)

---

### Retrieve Single Gist (`GET /gists/{id}`)

- Retrieve existing gist (`200 OK`)
- Validate response schema
- Validate ETag caching using `If-None-Match` (`304 Not Modified`)
- Reject invalid authentication credentials (`401 Unauthorized`)
- Return `404 Not Found` for unknown gist IDs

---

### Update Gist (`PATCH /gists/{id}`)

- Update an existing gist (`200 OK`)
- Reject unauthenticated requests (`401 Unauthorized`)
- Return `404 Not Found` for unknown gist IDs
- Reject invalid request payloads (`422 Unprocessable Entity`)

---

### Delete Gist (`DELETE /gists/{id}`)

- Delete an existing gist (`204 No Content`)
- Reject unauthenticated requests (`401 Unauthorized`)
- Return `404 Not Found` for unknown gist IDs

---

## Additional Validation

- JSON Schema validation using AJV
- Common response header validation
- Automatic cleanup of test data after execution
- Reusable API client abstraction
- Reusable authentication fixtures
- Reusable payload factories for maintainable test data

---

# Acceptance Criteria Traceability

| Acceptance Criteria | Automated Test | API Endpoint | Expected Response |
| --- | --- | --- | --- |
| Create private gist | `creates private gist successfully` | `POST /gists` | `201 Created` |
| Create public gist | `creates public gist successfully` | `POST /gists` | `201 Created` |
| Reject unauthenticated creation | `rejects creating gist without authorization header` | `POST /gists` | `401 Unauthorized` |
| Reject invalid payload | `rejects invalid gist payload` | `POST /gists` | `422 Unprocessable Entity` |
| Retrieve authenticated gists | `retrieves authenticated user's gists successfully` | `GET /gists` | `200 OK` |
| Validate ETag caching | `returns 304 when gists have not changed` | `GET /gists` | `304 Not Modified` |
| Retrieve gist by ID | `retrieves gist by ID successfully` | `GET /gists/{id}` | `200 OK` |
| Validate single gist caching | `returns 304 when gist has not changed` | `GET /gists/{id}` | `304 Not Modified` |
| Reject invalid authentication | `rejects retrieving gist with valid authorization header` | `GET /gists/{id}` | `401 Unauthorized` |
| Reject unknown gist ID | `returns 404 for unknown gist ID` | `GET /gists/{id}` | `404 Not Found` |
| Update gist | `updates gist description successfully` | `PATCH /gists/{id}` | `200 OK` |
| Reject invalid update payload | `rejects invalid update payload` | `PATCH /gists/{id}` | `422 Unprocessable Entity` |
| Delete gist | `deletes gist successfully` | `DELETE /gists/{id}` | `204 No Content` |

---

# Future Improvements

- Add UI test coverage
- Improve CI stability with retry logic
- Add remaining GitHub Gists API endpoints:

  - Star gist
  - Fork gist
  - Comments API
  - Public gist retrieval scenarios