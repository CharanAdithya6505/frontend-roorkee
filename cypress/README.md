# Cypress End-to-End (E2E) Testing

This repository contains the end-to-end (E2E) test setup using [Cypress](https://www.cypress.io/) for a frontend project. Cypress is a JavaScript-based testing framework used for automating UI testing in web applications.

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Recommended LTS version)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

Navigate to the frontend repository and install dependencies:

```sh
# Go to the frontend repository
cd <frontend-project-folder>

# Install dependencies
npm install  # or yarn install
```

## Running Cypress Tests

### Open Cypress UI

To open the interactive Cypress test runner, run:
```sh
npx cypress open  # or yarn cypress open
```

This will launch the Cypress Test Runner, where you can run tests in an interactive environment.

### Run Tests in Headless Mode

To run tests in the terminal (headless mode), use:
```sh
npx cypress run  # or yarn cypress run
```

### Running Specific Tests

To run a specific test file, use:
```sh
npx cypress run --spec frontend/cypress/e2e/<test-file>.cy.js
```

## Folder Structure

```
frontend/
├── cypress/
│   ├── e2e/             # Test files
│   ├── fixtures/        # Mock data for API responses
│   ├── support/         # Custom commands and reusable functions
│   ├── downloads/       # Downloaded files during tests
│   ├── screenshots/     # Screenshots captured on failure
│   ├── videos/          # Recorded test runs (if enabled)
│
├── cypress.config.js    # Cypress configuration file
├── package.json         # Project dependencies and scripts
└── README.md            # This file
```

## Configuration

Cypress configuration can be modified in `frontend/cypress.config.mjs`. Some key settings include:

```js
import { defineConfig } from 'cypress';
import dotenv from 'dotenv'
dotenv.config({ path: './.env'})
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', 
    env: {
      apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL
    },
    setupNodeEvents(on, config) {
      // Add any necessary node event listeners here
    },
  },
});

```

## Writing Tests

Cypress test files are located in the `frontend/cypress/e2e/` directory. A basic test looks like this:

```js
describe('My First Test', () => {
  it('Visits the home page', () => {
    cy.visit('/');
    cy.contains('Welcome');
  });
});
```

## Environment Variables

Environment variables are stored in cypress.config.js under the env property and accessed using Cypress.env():

const apiKey = Cypress.env('apiKey');

This approach ensures sensitive data remains within the configuration and can be modified centrally.

## Debugging

- Use `cy.log()` to print custom messages in the Cypress test runner.
- Use `cy.pause()` to halt execution for debugging.
- Check screenshots and videos under `frontend/cypress/screenshots/` and `frontend/cypress/videos/` if tests fail.

## CI/CD Integration

To run tests in a CI environment, use:
```sh
npx cypress run --browser chrome
```

For GitHub Actions, add a `.github/workflows/cypress.yml` file with:
```yaml
name: Cypress Tests

on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v4
        with:
          build: npm install
          start: npm start
```

## References

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices.html)

## License

This project is licensed under the MIT License.

