import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',      // kjer so testi
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  reporter: [['list']],   // tip poročila
  use: {
    headless: false,      // false = vidiš okno brskalnika
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',  // Playwright bo sam zagnal tvoj dev server
    port: 3000,
    reuseExistingServer: true,
  },
});
