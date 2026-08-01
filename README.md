# GitHub Gists API Automation

## Tech Stack
- Playwright API Testing
- JavaScript
- GitHub REST API

## Setup

npm install

Create .env:

GITHUB_TOKEN=<token>

## Running Tests

npx playwright test 

## GitHub Gists API Tests

This test suite validates the core CRUD functionality of the GitHub Gists REST API using Playwright.

### Coverage

#### Create Gist (`POST /gists`)
- Create private gist
- Create public gist
- Create gist with multiple file types
- Reject unauthenticated requests (`401`)
- Reject invalid request payloads (`422`)

#### Retrieve Gists (`GET /gists`)
- Retrieve authenticated user's gists (`200`)
- Validate ETag caching using `If-None-Match` (`304`)

#### Retrieve Single Gist (`GET /gists/{id}`)
- Retrieve existing gist (`200`)
- Validate ETag caching using `If-None-Match` (`304`)
- Reject invalid bearer token (`401`)
- Return `404` for unknown gist IDs

#### Update Gist (`PATCH /gists/{id}`)
- Update an existing gist (`200`)
- Reject unauthenticated requests (`401`)
- Return `404` for unknown gist IDs
- Reject invalid request payloads (`422`)

#### Delete Gist (`DELETE /gists/{id}`)
- Delete an existing gist (`204`)
- Reject unauthenticated requests (`401`)
- Return `404` for unknown gist IDs`

### Additional Validation

- JSON Schema validation using AJV
- Common response header validation
- Automatic cleanup of test data after execution
- Reusable API client built using the Page Object Model (POM) pattern
- Reusable test fixtures and payload factories for maintainable test data

## Future Improvements

- Add CI/CD using GitHub Actions
- Add contract testing
- Add reporting integration
- Add environment support