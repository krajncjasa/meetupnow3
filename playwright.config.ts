import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',      // mapa, kjer so tvoji testi
  timeout: 60 * 1000,   // povečaj timeout za počasnejše operacije
  workers: 1,           // uporabi samo enega workerja da se izogneš paralelnih težav
  expect: {
    timeout: 10000      // povečaj timeout za expect stavke
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }]
  ],
  use: {
    headless: false,      // vidiš okno brskalnika med testiranjem
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',  // posname video samo ob napakah
    screenshot: 'only-on-failure', // posname screenshot samo ob napakah
    trace: 'retain-on-failure',   // shrani trace samo ob napakah
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Lahko dodaš še druge brskalnike
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  webServer: {
    command: 'npm run dev',  // Playwright bo sam zagnal dev server
    port: 3000,
    reuseExistingServer: true,
    timeout: 120 * 1000,     // povečaj timeout za zagon serverja
  },
  // Global setup in teardown
  globalSetup: require.resolve('./e2e/global-setup.ts'),
  globalTeardown: require.resolve('./e2e/global-teardown.ts'),
});
