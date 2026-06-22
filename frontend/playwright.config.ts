import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E config — chromium only (disk-conscious).
 *
 * Before the first run you must install the browser:
 *   export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 22
 *   npx playwright install chromium
 *
 * The suite boots the production server itself via `webServer` below.
 * Clerk/Supabase env vars must be present in .env.local for the server to start.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Set PLAYWRIGHT_SKIP_WEBSERVER=1 to run against an already-running `npm run start`.
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'npm run build && npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
