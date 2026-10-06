import { expect, test } from "@playwright/test";

for (const path of ["/mariage", "/mariage/demo?skip", "/mariage/demo?jourj"]) {
    test(`${path} se charge sans erreur dans la console`, async ({ page }) => {
        const errors: string[] = [];
        page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
        page.on("pageerror", (error) => errors.push(error.message));

        await page.goto(path);
        await page.waitForLoadState("networkidle");

        expect(errors).toEqual([]);
    });
}
