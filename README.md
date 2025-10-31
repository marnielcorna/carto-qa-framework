## Overview

This project contains API and Ui Test cases focused in data driven frameworks.

* **UI End-to-End Testing** (Chromium & Firefox)
* **API Testing** (REST endpoints)

It includes:

* Centralized **test data and scenario management**
* **ESLint** for code quality.
* **Dynamic user and token creation** for API tests
* **Secure environment configuration** with `.env`
* **CI/CD integration** via GitHub Actions

## Project Structure

```
carto_projects/
│
├── tests/
│   ├── api/
│   │   ├── data/
│   │   │   ├── api-testdata.json
│   │   ├── suite/
│   │   │   ├── account.spec.ts
│   │   │   ├── bookstore.spec.ts
│   │   └── utils/
│   │       ├── apiHelper.ts
│   │       ├── apiLogger.ts
│   │       ├── userSession.ts
│   │
│   └── ui/
│       ├── data/
│       │   ├── regression.json
│       │   │   ├── Tests**.json
│       │   ├── smoke.json
│       │   │   ├── Tests**.json
│       │   ├── api-testdata.json
│       ├── auth.setup.ts
│       ├── specs/
│       │   ├── regression/
│       │   ├── smoke/
│
├── playwright.config.ts
├── .eslintrc.json
├── .env
└── package.json
```

## Setup

### Install dependencies

```bash
npm ci
```

### Install Playwright browsers

```bash
npx playwright install --with-deps
```

### Environment configuration

Create a `.env` file in the project root:

```bash
API_URL=https://demoqa.com
API_USER_NAME=your_test_user
API_USER_PASSWORD=your_test_password
CARTO_BASE_URL=https://clausa.app.carto.com
UI_USERNAME=your_email@example.com
UI_PASSWORD=your_password
```

## Run Tests Locally

### API tests

```bash
npm run test:api
```

### UI tests
For running Test by browser, you can run:
```bash
npm test:ui:chromium
npm test:ui:firefox
```

For running all UI test cases:
```bash
npm run test:ui:all
npm run test:ui:smoke
npm run test:ui:regression
```

For running Test cases based on Suites:
```bash
npm run test:ui:smoke
npm run test:ui:regression
```

For running all API Tests:
```bash
npm run test:ui:api
```

### Run all tests (UI + API)

```bash
npx playwright test
```

## Reports

After execution:

```bash
npm report:open
```


## ES Lint validation

Run ESLint manually:

```bash
npm lint
```

## CI/CD Pipeline (GitHub Actions)

The workflow runs:

1. **Linting**
2. **UI tests** (Chromium & Firefox)
3. **API tests**
4. **Fulll Tests “All Tests” validation**

Each test group uploads its own HTML report as a GitHub artifact.