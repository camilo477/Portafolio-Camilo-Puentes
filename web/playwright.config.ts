import { defineConfig, devices } from '@playwright/test';

const testPort = Number(process.env.PORTFOLIO_TEST_PORT ?? 4322);
if (!Number.isInteger(testPort) || testPort < 1 || testPort > 65535) {
  throw new Error('PORTFOLIO_TEST_PORT must be a valid TCP port.');
}
const baseURL = `http://127.0.0.1:${testPort}`;

export default defineConfig({
  testDir: './tests',
  testMatch: process.env.CAPTURE_SCREENSHOTS
    ? '**/screenshots.spec.ts'
    : '**/{portfolio,technologies,refinements,cases,ux,homelab,sidebars,experience}.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {},
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: `npm run preview -- --port ${testPort} --ignore-lock`,
    url: `${baseURL}/es/`,
    reuseExistingServer: false,
    env: { ASTRO_TELEMETRY_DISABLED: '1' },
  },
});
