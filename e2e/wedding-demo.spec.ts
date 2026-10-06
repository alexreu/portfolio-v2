import { expect, test } from "@playwright/test";

test.describe("site démo Camille & Hugo", () => {
    test("répondre pour tout le foyer transforme l'onglet Répondre en Répondu", async ({
        page,
        isMobile,
    }) => {
        test.skip(!isMobile, "la barre du bas n'existe que sur mobile");
        await page.goto("/mariage/demo?skip");

        const tabBar = page.getByRole("navigation", { name: "Accès rapide" });
        await expect(tabBar.getByRole("link", { name: "Répondre" })).toBeVisible();

        const form = page.getByRole("form", { name: "Votre réponse" });
        for (const guest of ["Marie", "Thomas"]) {
            for (const moment of ["Cérémonie & vin d'honneur", "Dîner & soirée", "Brunch"]) {
                await form
                    .getByRole("group", { name: `${guest}, ${moment}` })
                    .getByRole("button", { name: /^Présent/ })
                    .click();
            }
        }
        await form.getByRole("button", { name: "Envoyer notre réponse" }).click();

        await expect(page.getByRole("status")).toContainText("Merci");
        await expect(tabBar.getByRole("link", { name: "Répondu" })).toBeVisible();
    });

    test("le jour J, le lien personnel montre la table, le moment en cours et l'envoi de photos signé", async ({
        page,
        isMobile,
    }) => {
        test.skip(!isMobile, "la barre du bas n'existe que sur mobile");
        await page.goto("/mariage/demo?skip");

        await page.getByRole("button", { name: "Aperçu jour J" }).click();

        const day = page.getByRole("region", { name: "Bienvenue Marie & Thomas" });
        await expect(day).toContainText("Votre table");
        await expect(day).toContainText("Les Oliviers");
        await expect(day).toContainText("En ce moment");
        await expect(day).toContainText("Vin d'honneur");

        await page
            .getByRole("navigation", { name: "Accès rapide" })
            .getByRole("button", { name: "Ajouter" })
            .click();

        const sheet = page.getByRole("dialog", { name: "Partager vos photos" });
        await expect(sheet).toContainText("Envoyées au nom de Marie Lefèvre");
        await page.keyboard.press("Escape");
        await expect(sheet).toBeHidden();
    });

    test("une réponse incomplète signale ce qui manque et n'est pas envoyée", async ({ page }) => {
        await page.goto("/mariage/demo?skip");
        const form = page.getByRole("form", { name: "Votre réponse" });

        await form.getByRole("button", { name: "Envoyer notre réponse" }).click();

        await expect(form.getByRole("alert")).toContainText("Il reste 6 points à compléter");
        await expect(page.getByRole("status")).toHaveCount(0);
    });

    test("le faire-part s'ouvre au sceau et laisse place au site", async ({ page }) => {
        await page.goto("/mariage/demo");
        const invitation = page.getByRole("dialog", { name: /Camille/ });
        await expect(invitation).toContainText("Marie & Thomas");

        await invitation.getByRole("button", { name: "Ouvrir le faire-part" }).click();

        await expect(invitation).toBeHidden();
        await expect(page.getByRole("heading", { level: 1, name: /Camille/ })).toBeVisible();
    });
});
