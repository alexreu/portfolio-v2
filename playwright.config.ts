import { defineConfig, devices } from "@playwright/test";

const port = 3100;
/** Point at an already running server (e.g. `pnpm dev`) to skip the production build. */
const externalBaseUrl = process.env.E2E_BASE_URL;

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    reporter: "list",
    use: {
        baseURL: externalBaseUrl ?? `http://localhost:${port}`,
        trace: "retain-on-failure",
    },
    projects: [
        { name: "mobile", use: { ...devices["Pixel 7"] } },
        { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    ],
    webServer: externalBaseUrl
        ? undefined
        : {
              command: `pnpm build && pnpm start -p ${port}`,
              url: `http://localhost:${port}`,
              reuseExistingServer: !process.env.CI,
              timeout: 240_000,
          },
});
