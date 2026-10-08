import { expect, test } from "@playwright/test";

test.describe("pages ouvertes par les QR codes du jour J (démo)", () => {
    test("le plan de table trouve sa table par le nom ou le prénom, sans faire-part", async ({
        page,
    }) => {
        await page.goto("/mariage/demo/plan-de-table");
        await expect(page.getByRole("heading", { level: 1 })).toHaveText("Trouvez votre table");
        await expect(page.getByRole("button", { name: /ouvrir le faire-part/i })).toHaveCount(0);

        const search = page.getByLabel("Votre prénom ou votre nom");
        await search.fill("moreau");
        const found = page.getByRole("list", { name: "Invités trouvés" });
        await expect(found.getByRole("button", { name: /^Claire/ })).toContainText("Table 1");

        await search.fill("Claire Mor");
        await found.getByRole("button", { name: /^Claire/ }).click();
        await expect(page.getByRole("status")).toContainText("Claire, vous êtes à la");
        await expect(page.getByRole("status")).toContainText("Les Lavandes");
        await expect(
            page.getByRole("img", { name: "Plan de la salle, table 1 en surbrillance" }),
        ).toBeVisible();

        await expect(
            page
                .getByRole("region", { name: "Qui est à quelle table" })
                .getByRole("button", { name: /^Table 1, Les Lavandes : .*Claire/ }),
        ).toBeVisible();
    });

    test("un nom inconnu le dit, sans rien allumer", async ({ page }) => {
        await page.goto("/mariage/demo/plan-de-table");
        await page.getByLabel("Votre prénom ou votre nom").fill("Zzz");

        await expect(page.getByText("Personne à ce nom parmi les invités du dîner.")).toBeVisible();
    });

    test("la galerie demande prénom et nom avant d'entrer, puis signe les photos", async ({
        page,
    }) => {
        await page.goto("/mariage/demo/galerie");
        const door = page.getByRole("form", { name: "Qui êtes-vous ?" });
        await door.getByRole("button", { name: "Entrer dans la galerie" }).click();
        await expect(door.getByText("Votre nom.")).toBeVisible();
        await expect(page.getByRole("list", { name: "Photos partagées" })).toHaveCount(0);

        await door.getByLabel("Prénom", { exact: true }).fill("Léa");
        await door.getByLabel("Nom", { exact: true }).fill("Dubois");
        await door.getByRole("button", { name: "Entrer dans la galerie" }).click();

        await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vu par vous");
        await expect(page.getByRole("list", { name: "Photos partagées" })).toBeVisible();
        await page.getByRole("button", { name: "Ajouter mes photos" }).click();
        await expect(page.getByRole("dialog", { name: "Partager vos photos" })).toContainText(
            "Léa Dubois",
        );

        await page.reload();
        await expect(page.getByText("Bonjour Léa Dubois")).toBeVisible();
    });
});
