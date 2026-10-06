import { defineConfig, devices } from "@playwright/test";

const port = 3100;

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    reporter: "list",
    use: {
        baseURL: `http://localhost:${port}`,
        trace: "retain-on-failure",
    },
    projects: [
        { name: "mobile", use: { ...devices["Pixel 7"] } },
        { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    ],
    webServer: {
        command: `pnpm build && pnpm start -p ${port}`,
        url: `http://localhost:${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
    },
});
