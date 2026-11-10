import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'Desktop Chrome 16:9',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'Desktop 4:3 (Legacy)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 }
      }
    },
    {
      name: 'Mobile Chrome (Landscape)',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 915, height: 412 }
      }
    },
    {
      name: 'Mobile Safari (Portrait - Orientation Check)',
      use: {
        ...devices['iPhone 14'],
        viewport: { width: 390, height: 844 }
      }
    }
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
});
