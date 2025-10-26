import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: process.env.CARTO_BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'auth-setup',
      testDir: './tests/ui',
      testMatch: /.*auth\.setup\.ts/,
    },
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'auth.json',
      },
      dependencies: ['auth-setup'],
    },
    {
      name: 'ui-firefox',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'auth.json',
      },
      dependencies: ['auth-setup'],
    },
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_URL,
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },
  ],
});
