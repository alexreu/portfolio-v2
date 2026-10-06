import { expect, test } from "@playwright/test";

test("la carte « Sites de mariage » de la home mène à l'offre", async ({ page }) => {
    await page.goto("/");
    const card = page.getByRole("region", { name: /Votre mariage mérite mieux/ });

    await expect(card).toContainText("dès 290 €");
    await card.getByRole("link", { name: "Découvrir l'offre" }).click();

    await expect(page).toHaveURL(/\/mariage$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Un site à votre image");
});
