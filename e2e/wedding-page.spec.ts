import { expect, test } from "@playwright/test";

test.describe("page /mariage", () => {
    test("« Choisir Intime » coche la formule sans recharger ni vider le formulaire", async ({
        page,
    }) => {
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

    test("« Qui suis-je » mène à la photo et aux mots d'Alexandre, sans quitter l'offre", async ({
        page,
    }) => {
        await page.goto("/mariage");
        const about = page.getByRole("region", { name: /^Une seule personne/ });

        await expect(about.getByRole("img", { name: /^Alexandre Adolphe/ })).toBeVisible();
        await expect(
            about.getByRole("link", { name: /Voir mes autres réalisations/ }),
        ).toHaveAttribute("href", "/");
        await expect(page.getByRole("link", { name: "Retour au portfolio" })).toHaveCount(0);
    });
});
