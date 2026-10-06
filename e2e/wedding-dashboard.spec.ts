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
            page.getByRole("heading", { level: 1, name: "Bonjour Camille & Hugo" }),
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

    test("les dates changées dans le tableau de bord s'appliquent au site des invités", async ({
        page,
    }) => {
        await page.goto(DASHBOARD);
        const dates = page.getByRole("region", { name: "Dates clés" });
        await dates.getByLabel("Date du mariage").fill("2027-09-04");
        await dates.getByLabel("Date limite des réponses").fill("2027-08-01");
        await dates.getByRole("button", { name: "Enregistrer les dates" }).click();
        await expect(dates.getByRole("status")).toContainText("réponses avant le 1er août 2027");

        await page.goto("/mariage/demo?skip");
        await expect(page.locator("main")).toContainText("Samedi 4 septembre 2027");
        await expect(page.locator("#rsvp")).toContainText("1er août 2027");
        await expect(page.locator("#programme")).toContainText("4 septembre");
    });

    test("un moment ajouté au programme apparaît chez les invités", async ({ page }) => {
        await page.goto(DASHBOARD);
        const programme = page.getByRole("region", { name: "Programme" });
        await programme.getByRole("button", { name: "Ajouter un moment" }).click();

        const dialog = page.getByRole("dialog", { name: "Nouveau moment" });
        await dialog.getByLabel("Nom du moment").fill("Mairie");
        await dialog.getByLabel("Intitulé").fill("Mariage civil");
        await dialog.getByLabel("Lieu").fill("Mairie de Lourmarin");
        await dialog.getByLabel("Date", { exact: true }).fill("2027-06-11");
        await dialog.getByLabel("Début").fill("11:00");
        await dialog.getByRole("button", { name: "Ajouter le moment" }).click();
        await expect(programme).toContainText("Mariage civil");

        await page.goto("/mariage/demo?skip");
        await expect(page.getByRole("region", { name: "Le déroulé" })).toContainText(
            "Mariage civil",
        );
        await expect(
            page
                .getByRole("form", { name: "Votre réponse" })
                .getByRole("group", { name: "Marie, Mairie" }),
        ).toBeVisible();
    });

    test("une question ajoutée au faire-part est posée aux invités", async ({ page }) => {
        await page.goto(DASHBOARD);
        const questions = page.getByRole("region", { name: "Questions du faire-part" });
        await questions.getByRole("button", { name: "Ajouter une question" }).click();
        await questions
            .getByRole("textbox", { name: "Question 2", exact: true })
            .fill("Besoin d'une place en covoiturage ?");
        await questions.getByRole("button", { name: "Enregistrer les questions" }).click();
        await expect(questions.getByRole("status")).toContainText("Enregistrées");

        await page.goto("/mariage/demo?skip");
        await expect(
            page
                .getByRole("form", { name: "Votre réponse" })
                .getByLabel("Besoin d'une place en covoiturage ?"),
        ).toBeVisible();
    });

    test("le plan de table placé par les mariés s'affiche le jour J", async ({ page }) => {
        await page.goto(DASHBOARD);
        const seating = page.getByRole("region", { name: "Plan de table · dîner" });
        await expect(seating).toContainText("4 invités au dîner n'ont pas encore de table.");

        await seating
            .getByLabel("Placer Famille Mercier à une table")
            .selectOption({ label: "Table 8 · Les Mûriers (0/8)" });
        await expect(seating).not.toContainText("n'ont pas encore de table");

        await seating.getByRole("button", { name: /^Table 7, Les Oliviers/ }).click();
        const table = seating.getByRole("region", { name: "Table 7" });
        await table.getByLabel("Nom").fill("La Grande Oliveraie");
        await table.getByRole("button", { name: "Enregistrer la table" }).click();

        await page.goto("/mariage/demo?jourj");
        await expect(page.getByRole("region", { name: "Bienvenue Marie & Thomas" })).toContainText(
            "La Grande Oliveraie",
        );
    });

    test("la salle se renomme et une table se retire depuis le plan, sans alerte", async ({
        page,
    }) => {
        await page.goto(DASHBOARD);
        const seating = page.getByRole("region", { name: "Plan de table · dîner" });
        await seating.getByLabel("Nom, écrit à l'entrée").fill("La grange");
        await seating.getByLabel("Taille").selectOption("m");

        await seating.getByRole("button", { name: /^Table 8, Les Mûriers/ }).click();
        await seating.getByRole("button", { name: "Retirer la table 8" }).click();
        await page
            .getByRole("dialog", { name: "Retirer la table 8 ?" })
            .getByRole("button", { name: "Retirer" })
            .click();
        await expect(seating.getByRole("button", { name: /^Table 8,/ })).toHaveCount(0);

        await page.goto("/mariage/demo?jourj");
        await page.getByRole("button", { name: "Voir le plan" }).click();
        await expect(page.locator("#plan-salle")).toContainText("Entrée · La grange");
    });

    test("sur téléphone, le menu suit la section lue", async ({ page, isMobile }) => {
        test.skip(!isMobile, "la barre défilante n'existe que sur mobile");
        await page.goto(DASHBOARD);
        const strip = page.locator('header nav[aria-label="Sections du tableau de bord"] ul');
        await expect(strip).toBeVisible();

        await page.locator("#galerie").scrollIntoViewIfNeeded();
        await expect.poll(() => strip.evaluate((list) => list.scrollLeft)).toBeGreaterThan(0);
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

        await page.getByRole("button", { name: "Réinitialiser", exact: true }).first().click();
        await page
            .getByRole("dialog", { name: "Revenir aux données de départ ?" })
            .getByRole("button", { name: "Réinitialiser" })
            .click();
        await expect(page.getByRole("region", { name: "Activité récente" })).not.toContainText(
            "Relance envoyée à 8 foyers",
        );
    });
});
