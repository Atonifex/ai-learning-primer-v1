import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  // Bootstrap fixtures share the seeded captain and reset its onboarding state.
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  // These integration tests use a remote development DB and lazy Next route compilation.
  // Assert eventual UI state without turning a cold route into a 5-second performance test.
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `"${process.execPath}" node_modules/next/dist/bin/next dev`,
    // Readiness must not depend on the signed-in homepage's database queries.
    url: `${baseURL}/dev/agent`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
