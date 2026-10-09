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
        await form.getByRole("button", { name: /^Envoyer (ma|notre) réponse$/ }).click();

        await expect(page.getByRole("status")).toContainText("Merci");
        await expect(tabBar.getByRole("link", { name: "Répondu" })).toBeVisible();
    });

    test("le menu met en avant la section où l'on se trouve", async ({ page, isMobile }) => {
        await page.goto("/mariage/demo?skip");
        const menu = isMobile
            ? page.getByRole("navigation", { name: "Accès rapide" })
            : page.getByRole("navigation", { name: "Sections" });

        await menu.getByRole("link", { name: "Lieux" }).click();
        await expect(menu.getByRole("link", { name: "Lieux" })).toHaveAttribute(
            "aria-current",
            "location",
        );
        await expect(menu.locator("[aria-current]")).toHaveCount(1);

        await menu.getByRole("link", { name: "Programme" }).click();
        await expect(menu.getByRole("link", { name: "Programme" })).toHaveAttribute(
            "aria-current",
            "location",
        );
        await expect(menu.getByRole("link", { name: "Lieux" })).not.toHaveAttribute("aria-current");
    });

    test("une fois la réponse envoyée, le merci s'affiche à l'écran et reçoit le focus", async ({
        page,
    }) => {
        await page.goto("/mariage/demo?skip");
        const form = page.getByRole("form", { name: "Votre réponse" });
        for (const guest of ["Marie", "Thomas"]) {
            for (const moment of ["Cérémonie & vin d'honneur", "Dîner & soirée", "Brunch"]) {
                await form
                    .getByRole("group", { name: `${guest}, ${moment}` })
                    .getByRole("button", { name: /^Présent/ })
                    .click();
            }
        }
        await form.getByRole("button", { name: /^Envoyer (ma|notre) réponse$/ }).click();

        const thanks = page.getByRole("status").filter({ hasText: "Merci" });
        await expect(thanks).toBeInViewport({ ratio: 1 });
        await expect(page.locator("#rsvp-answer")).toBeFocused();
    });

    test("le jour J, le lien personnel montre la table, le moment en cours et l'envoi de photos signé", async ({
        page,
        isMobile,
    }) => {
        test.skip(!isMobile, "la barre du bas n'existe que sur mobile");
        await page.goto("/mariage/demo?skip");

        await page.getByLabel("Démonstration : voir le site").selectOption("day");

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

        await form.getByRole("button", { name: /^Envoyer (ma|notre) réponse$/ }).click();

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

    test("même rechargé après avoir défilé, le faire-part ouvre le site en haut de page", async ({
        page,
    }) => {
        await page.goto("/mariage/demo");
        await page.getByRole("button", { name: "Ouvrir le faire-part" }).click();
        await expect(page.getByRole("dialog")).toBeHidden();
        await page.evaluate(() => window.scrollTo(0, 600));
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);

        await page.reload();
        await page.getByRole("button", { name: "Ouvrir le faire-part" }).click();
        await expect(page.getByRole("dialog")).toBeHidden();

        expect(await page.evaluate(() => window.scrollY)).toBe(0);
        await expect(page.getByRole("heading", { level: 1, name: /Camille/ })).toBeInViewport({
            ratio: 1,
        });
    });

    test("l'ouverture du faire-part se passe d'un geste", async ({ page }) => {
        await page.goto("/mariage/demo");
        const invitation = page.getByRole("dialog", { name: /Camille/ });

        await invitation.getByRole("button", { name: "Ouvrir le faire-part" }).click();
        await invitation.getByRole("button", { name: "Passer" }).click();

        await expect(invitation).toBeHidden({ timeout: 1_000 });
    });

    test("une photo de la galerie s'affiche en grand et se parcourt au clavier", async ({
        page,
    }) => {
        await page.goto("/mariage/demo?skip&jourj");

        await page.getByRole("button", { name: "Agrandir la photo de Léa" }).click();
        await expect(page.getByRole("dialog", { name: "Photo de Léa, 1 sur 8" })).toBeVisible();

        await page.keyboard.press("ArrowRight");
        await expect(page.getByRole("dialog", { name: "Photo de Thomas, 2 sur 8" })).toBeVisible();

        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toBeHidden();
    });

    test("la carte des lieux situe le domaine et donne son adresse", async ({ page }) => {
        await page.goto("/mariage/demo?skip");
        const map = page.getByRole("region", { name: "Carte des lieux" });
        await map.scrollIntoViewIfNeeded();

        await map.getByTitle("Domaine des Oliviers").click();
        await expect(map).toContainText("Route de Vaugines, 84160 Lourmarin");
        await expect(map).toContainText("OpenStreetMap");
    });

    test("le compte à rebours égrène les secondes", async ({ page }) => {
        await page.goto("/mariage/demo?skip");
        const countdown = page.getByLabel("Compte à rebours");
        await expect(countdown).toContainText("secondes");
        await expect(countdown).not.toContainText("–");

        const before = await countdown.textContent();
        await expect.poll(() => countdown.textContent(), { timeout: 2_500 }).not.toBe(before);
    });
});

test.describe("lien personnel inconnu (démo)", () => {
    test("la page envoyée ne contient l'invitation d'aucun autre foyer", async ({ request }) => {
        for (const query of [
            "foyer=inconnu-x1",
            "foyer=inconnu-x1&skip",
            "foyer=inconnu-x1&jourj",
        ]) {
            const html = await (await request.get(`/mariage/demo?${query}`)).text();

            expect(html).not.toContain("Marie &amp; Thomas");
        }
    });

    test("il finit sur « Ce lien n'est plus valide », sans passer par un autre foyer", async ({
        page,
    }) => {
        await page.goto("/mariage/demo?foyer=inconnu-x1&skip");

        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            "Ce lien n'est plus valide",
        );
        await expect(page.getByText("Marie & Thomas")).toHaveCount(0);
    });
});
