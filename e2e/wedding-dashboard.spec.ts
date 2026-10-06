import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

const DASHBOARD = "/mariage/demo/tableau-de-bord";

const households = (page: Page) => page.getByRole("region", { name: "Foyers invités" });

const answerEveryMoment = async (
    page: Page,
    guests: readonly string[],
    answer: RegExp,
    extras: { song?: string; message?: string } = {},
) => {
    const form = page.getByRole("form", { name: "Votre réponse" });
    if (extras.song) await form.getByLabel("Une chanson qui vous fera danser").fill(extras.song);
    if (extras.message) await form.getByLabel("Un mot pour nous").fill(extras.message);
    for (const group of await form.getByRole("group").all()) {
        const name = await group.getAttribute("aria-label");
        if (guests.some((guest) => name?.startsWith(`${guest},`)))
            await group.getByRole("button", { name: answer }).click();
    }
    await form.getByRole("button", { name: "Envoyer notre réponse" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Merci" })).toBeVisible();
};

test.describe("tableau de bord des mariés (démo)", () => {
    test("la page /mariage mène à la démo du tableau de bord", async ({ page }) => {
        await page.goto("/mariage");
        await page.getByRole("link", { name: "Essayer le tableau de bord" }).click();

        await expect(page).toHaveURL(DASHBOARD);
        await expect(
            page.getByRole("heading", { level: 1, name: "Bonjour Camille" }),
        ).toBeVisible();
    });

    test("un faire-part créé ouvre un site adressé au foyer, dont la réponse revient au tableau", async ({
        page,
    }) => {
        await page.goto(DASHBOARD);
        await expect(households(page)).toContainText("22 foyers");

        await page.getByRole("button", { name: "Créer un faire-part" }).first().click();
        const dialog = page.getByRole("dialog", { name: "Nouveau faire-part" });
        await dialog.getByLabel("Nom du foyer").fill("Tante Brigitte");
        await dialog.getByLabel("Prénom de la personne 1").fill("Brigitte");
        await dialog.getByRole("button", { name: "Créer le faire-part" }).click();

        await expect(dialog.getByRole("status")).toContainText(
            "Le faire-part de Tante Brigitte est prêt",
        );
        const link = await dialog.getByLabel("Lien personnel").inputValue();
        await dialog.getByRole("button", { name: "Fermer" }).click();
        await expect(households(page)).toContainText("23 foyers");
        await expect(households(page)).toContainText("Tante Brigitte");

        await page.goto(link);
        const invitation = page.getByRole("dialog", { name: /Camille/ });
        await expect(invitation).toContainText("Tante Brigitte");
        await invitation.getByRole("button", { name: "Ouvrir le faire-part" }).click();
        await expect(invitation).toBeHidden();
        await answerEveryMoment(page, ["Brigitte"], /^Oui$/);

        await page.goto(DASHBOARD);
        await expect(page.getByRole("region", { name: "Activité récente" })).toContainText(
            "Tante Brigitte a répondu",
        );
    });

    test("la réponse de Marie & Thomas sur le site fait bouger les chiffres", async ({ page }) => {
        await page.goto(DASHBOARD);
        const indicators = page.getByLabel("Indicateurs");
        await expect(indicators).toContainText("27/ 41 invités");

        await page.goto("/mariage/demo?skip");
        await answerEveryMoment(page, ["Marie", "Thomas"], /^Présent/);

        await page.goto(DASHBOARD);
        await expect(indicators).toContainText("29/ 41 invités");
        await expect(page.getByRole("region", { name: "Activité récente" })).toContainText(
            "Marie & Thomas a répondu",
        );
    });

    test("le détail d'une réponse dit qui vient, avec la chanson et le petit mot", async ({
        page,
    }) => {
        await page.goto("/mariage/demo?skip");
        await answerEveryMoment(page, ["Marie", "Thomas"], /^Présent/, {
            song: "Daft Punk — One More Time",
            message: "Trop hâte de fêter ça !",
        });

        await page.goto(DASHBOARD);
        await page
            .getByRole("button", { name: "Voir la réponse de Marie & Thomas" })
            .first()
            .click();

        const detail = page.getByRole("dialog", { name: "Marie & Thomas" });
        await expect(detail.getByRole("region", { name: "Qui vient" })).toContainText("Présente");
        await expect(detail.getByRole("region", { name: "Vos questions" })).toContainText(
            "Daft Punk — One More Time",
        );
        await expect(detail.getByRole("region", { name: "Leur mot" })).toContainText(
            "Trop hâte de fêter ça !",
        );
        await expect(detail.getByRole("region", { name: "Historique" })).toContainText(
            "Réponse envoyée",
        );
    });

    test("ouvrir un détail laisse la navigation collée en haut de l'écran", async ({ page }) => {
        await page.goto(DASHBOARD);
        /** The modal hides the page from assistive technology: found by its markup instead. */
        const navigation = page.locator('nav[aria-label="Sections du tableau de bord"]:visible');
        await page
            .getByRole("button", { name: "Voir la réponse de Famille Moreau" })
            .first()
            .click();
        await expect(page.getByRole("dialog", { name: "Famille Moreau" })).toBeVisible();

        const stuck = await navigation.evaluate((nav) => {
            const bar = nav.closest("aside, header") as HTMLElement;
            return { top: Math.round(bar.getBoundingClientRect().top), scrolled: window.scrollY };
        });
        expect(stuck.scrolled).toBeGreaterThan(0);
        expect(stuck.top).toBe(0);
    });

    test("le faire-part modifié par les mariés s'affiche chez les invités", async ({ page }) => {
        await page.goto(DASHBOARD);
        const editor = page.getByRole("region", { name: "Votre faire-part" });
        await editor.getByLabel("Premier prénom").fill("Élise");
        await editor.getByRole("radio", { name: "Terre" }).check();
        await editor.getByRole("button", { name: "Enregistrer le faire-part" }).click();
        await expect(editor.getByRole("status")).toContainText("Enregistré");

        await page.goto("/mariage/demo");
        await expect(page.getByRole("dialog", { name: /Élise/ })).toBeVisible();
    });

    test("une photo agrandie peut être retirée de la galerie", async ({ page }) => {
        await page.goto(DASHBOARD);
        const gallery = page.getByRole("region", { name: "Galerie des invités" });
        await expect(gallery).toContainText("8 photos visibles");

        await gallery.getByRole("button", { name: "Agrandir la photo de Léa" }).click();
        const viewer = page.getByRole("dialog", { name: /Photo de Léa/ });
        await viewer.getByRole("button", { name: "Retirer de la galerie" }).click();
        await expect(viewer).toContainText("Léa · retirée");
        await page.keyboard.press("Escape");

        await expect(gallery).toContainText("7 photos visibles");
    });

    test("l'export CSV donne la liste des invités pour le traiteur", async ({ page }) => {
        await page.goto(DASHBOARD);
        const [download] = await Promise.all([
            page.waitForEvent("download"),
            page.getByRole("button", { name: "Exporter CSV" }).click(),
        ]);

        expect(download.suggestedFilename()).toMatch(/\.csv$/);
        const csv = await readFile((await download.path()) ?? "", "utf8");
        expect(csv).toContain("Foyer;Groupe;Prénom;Enfant");
        expect(csv).toContain("Famille Moreau;Famille Hugo;Léo;Oui");
    });

    test("une relance s'inscrit dans l'activité, et la démo se réinitialise", async ({ page }) => {
        await page.goto(DASHBOARD);
        await page.getByRole("button", { name: "Relancer maintenant" }).first().click();
        await expect(page.getByRole("region", { name: "Activité récente" })).toContainText(
            "Relance envoyée à 8 foyers",
        );

        page.once("dialog", (dialog) => dialog.accept());
        await page.getByRole("button", { name: "Réinitialiser" }).first().click();
        await expect(page.getByRole("region", { name: "Activité récente" })).not.toContainText(
            "Relance envoyée à 8 foyers",
        );
    });
});
