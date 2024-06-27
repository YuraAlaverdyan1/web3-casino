import { defineConfig, devices } from '@playwright/test'

// https://play-ridotto-interface-git-rdtapp-1369-ridotto-dev.vercel.app/casino/
// https://play-ridotto-interface-git-e2e-base-ridotto-dev.vercel.app/casino/


export default defineConfig({
  workers: process.env.CI ? 1 : 1,
  timeout: 300000,
  use: {
    ignoreHTTPSErrors: true,
    actionTimeout: 0,
    navigationTimeout: 0,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    headless: false,
    baseURL: 'http://127.0.0.1:3000/',
  },
  webServer: [
    {
      command: 'export HOST=0 && npm run nuxt:dev',
      url: 'http://127.0.0.1:3000',
      timeout: 35000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run chain',
      url: 'http://127.0.0.1:8546',
      timeout: 20000,
      reuseExistingServer: !process.env.CI,
    }
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
