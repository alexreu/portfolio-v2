import { expect, test } from "@playwright/test";

test.describe("page /mariage", () => {
    test("« Choisir Intime » coche la formule sans recharger ni vider le formulaire", async ({ page }) => {
        await page.goto("/mariage");
        const names = page.getByLabel("Vos prénoms");
        await names.fill("Camille & Hugo");

        await page.getByRole("link", { name: "Choisir Intime" }).click();

        await expect(page.getByRole("radio", { name: "Intime" })).toBeChecked();
        await expect(names).toHaveValue("Camille & Hugo");
        await expect(page).toHaveURL(/\/mariage#contact$/);
    });

    test("un lien partagé ?formule=essentiel pré-coche Essentiel", async ({ page }) => {
        await page.goto("/mariage?formule=essentiel");

        await expect(page.getByRole("radio", { name: "Essentiel" })).toBeChecked();
    });
});
