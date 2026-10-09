import { expect, test } from "@playwright/test";

/** Vercel Analytics and Speed Insights scripts only exist once deployed on Vercel. */
const servedOnlyByVercel = (url: string) => new URL(url).pathname.startsWith("/_vercel/");

for (const path of ["/mariage", "/mariage/demo?skip", "/mariage/demo?jourj"]) {
    test(`${path} se charge sans erreur ni ressource manquante`, async ({ page }) => {
        const errors: string[] = [];
        const missing: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => {
            // Failed resources are checked below, by URL.
            if (message.type() === "error" && !message.text().startsWith("Failed to load resource"))
                errors.push(message.text());
        });
        page.on("response", (response) => {
            if (response.status() >= 400 && !servedOnlyByVercel(response.url()))
                missing.push(`${response.status()} ${response.url()}`);
        });

        await page.goto(path);
        await page.waitForLoadState("networkidle");

        expect(errors).toEqual([]);
        expect(missing).toEqual([]);
    });
}
