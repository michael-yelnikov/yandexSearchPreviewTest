import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    baseURL: 'https://yandex.ru',
    headless: false,
    trace: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      // testMatch: /.*\video.ts/ // as example for filtering tests with video checking
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // example for fixing Codecs globally 
      },
    },
  ],
});
