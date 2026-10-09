import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

const DASHBOARD = "/mariage/demo/tableau-de-bord";

/** One page of the dashboard, the overview without a name. */
const dashboard = (page = "") => (page ? `${DASHBOARD}/${page}` : DASHBOARD);

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
    await form.getByRole("button", { name: /^Envoyer (ma|notre) réponse$/ }).click();
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
        await expect(
            page.getByRole("region", { name: "Tout le tableau de bord" }).getByRole("link", {
                name: /^Invités/,
            }),
        ).toContainText("22 foyers");

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
        await expect(page).toHaveURL(dashboard("invites"));
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

    test("ouvrir le lien d'un foyer depuis le tableau ne compte pas comme sa visite", async ({
        page,
    }) => {
        await page.goto(dashboard("invites"));
        const open = households(page)
            .getByRole("link", {
                name: "Ouvrir le faire-part de Lucas & Emma Petit (nouvel onglet)",
            })
            .first();
        const href = (await open.getAttribute("href")) ?? "";
        expect(href).toMatch(/\?foyer=[^&]+&apercu$/);

        await page.goto(href);
        await expect(page.getByRole("note")).toContainText("Aperçu des mariés");
        await page.getByRole("button", { name: "Ouvrir le faire-part" }).click();
        await answerEveryMoment(page, ["Lucas", "Emma"], /^Oui$/);

        await page.goto(dashboard("invites"));
        await page
            .getByRole("button", { name: "Voir la réponse de Lucas & Emma Petit" })
            .first()
            .click();
        const detail = page.getByRole("dialog", { name: "Lucas & Emma Petit" });
        await expect(detail.getByRole("region", { name: "Historique" })).toContainText(
            "saisie par Camille",
        );
        await expect(detail).not.toContainText("Lien ouvert");
    });

    test("un foyer se corrige depuis son détail, sans changer de lien", async ({ page }) => {
        await page.goto(dashboard("invites"));
        await page
            .getByRole("button", { name: "Voir la réponse de Lucas & Emma Petit" })
            .first()
            .click();
        let detail = page.getByRole("dialog", { name: "Lucas & Emma Petit" });
        await detail.getByRole("button", { name: "Modifier le foyer" }).click();

        const form = detail.getByRole("form", { name: "Modifier Lucas & Emma Petit" });
        await expect(form.getByLabel("Prénom de la personne 1")).toHaveValue("Lucas");
        await form.getByLabel("Nom du foyer").fill("Lucas, Emma & Nina Petit");
        await form.getByRole("button", { name: "Ajouter une personne" }).click();
        await form.getByLabel("Prénom de la personne 3").fill("Nina");
        await form.getByRole("button", { name: "Enregistrer le foyer" }).click();

        detail = page.getByRole("dialog", { name: "Lucas, Emma & Nina Petit" });
        await expect(detail.getByRole("region", { name: "Qui vient" })).toContainText("Nina");
        await expect(detail.getByRole("region", { name: "Historique" })).toContainText(
            "Foyer modifié",
        );
        await page.keyboard.press("Escape");
        await expect(households(page)).toContainText("Lucas, Emma & Nina Petit");
    });

    test("une réponse reçue par courrier se saisit dans le détail du foyer", async ({ page }) => {
        await page.goto(dashboard("invites"));
        await page
            .getByRole("button", { name: "Voir la réponse de Lucas & Emma Petit" })
            .first()
            .click();
        const detail = page.getByRole("dialog", { name: "Lucas & Emma Petit" });
        await detail.getByRole("button", { name: "Saisir sa réponse" }).click();

        const form = detail.getByRole("form", { name: "Réponse de Lucas & Emma Petit" });
        await form.getByRole("button", { name: "Enregistrer leur réponse" }).click();
        await expect(form.getByRole("alert")).toContainText("à compléter");

        for (const yes of await form.locator("label").filter({ hasText: /^Oui$/ }).all())
            await yes.click();
        await form.getByRole("button", { name: "Enregistrer leur réponse" }).click();

        await expect(detail.getByRole("region", { name: "Qui vient" })).toContainText("Présent");
        await expect(detail.getByRole("region", { name: "Historique" })).toContainText(
            "saisie par Camille",
        );
        await expect(detail).not.toContainText("Lien ouvert");
    });

    test("un foyer retiré disparaît de la liste, et son lien ne montre plus rien", async ({
        page,
    }) => {
        await page.goto(dashboard("invites"));
        const preview =
            (await households(page)
                .getByRole("link", {
                    name: "Ouvrir le faire-part de Chloé Lambert (nouvel onglet)",
                })
                .first()
                .getAttribute("href")) ?? "";
        await page
            .getByRole("button", { name: "Voir la réponse de Chloé Lambert" })
            .first()
            .click();
        const detail = page.getByRole("dialog", { name: "Chloé Lambert", exact: true });
        await detail.getByRole("button", { name: "Retirer", exact: true }).click();
        await page.getByRole("button", { name: "Retirer le foyer" }).click();

        await expect(detail).toBeHidden();
        await expect(households(page)).toContainText("21 foyers");
        await expect(households(page)).not.toContainText("Chloé Lambert");

        await page.goto(preview.replace("&apercu", ""));
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            "Ce lien n'est plus valide",
        );
    });

    test("l'aperçu se dit dès l'enveloppe, et l'ouvrir ne compte pas comme une visite du foyer", async ({
        page,
    }) => {
        await page.goto("/mariage/demo?foyer=petit&apercu");
        const envelope = page.getByRole("dialog").filter({ hasText: "Lucas & Emma Petit" });
        await expect(envelope).toContainText("Aperçu des mariés");
        await envelope.getByRole("button", { name: "Ouvrir le faire-part" }).click();
        await expect(envelope).toBeHidden();

        await page.goto(dashboard());
        await expect(page.getByRole("region", { name: "Activité récente" })).not.toContainText(
            "Lucas & Emma Petit a ouvert son lien",
        );
    });

    test("l'aperçu d'un foyer ramène à son détail pour le corriger", async ({ page }) => {
        await page.goto("/mariage/demo?foyer=lefevre&apercu&skip");
        await page.getByRole("link", { name: "Corriger ce foyer" }).click();

        await expect(page).toHaveURL(dashboard("invites"));
        await expect(page.getByRole("dialog", { name: "Marie & Thomas" })).toBeVisible();
    });

    test("les sections réservées à une formule disent laquelle", async ({ page }) => {
        const cases = [
            ["plan-de-table", "Plan de table · dîner", "Signature · option Essentiel"],
            ["galerie", "Galerie des invités", "Dès Essentiel · option Intime"],
            ["faire-part", "Questions du faire-part", "Dès Essentiel · option Intime"],
            ["faire-part", "Faire-part à imprimer", "Dès Essentiel · option Intime"],
            ["galerie", "QR code de la galerie", "Dès Essentiel · option Intime"],
            ["plan-de-table", "QR code du plan de table", "Signature · option Essentiel"],
            ["relances", "Relances", "Dès Essentiel"],
            ["acces", "Accès au tableau de bord", "Signature · option Intime et Essentiel"],
        ] as const;
        for (const [path, name, plan] of cases) {
            await page.goto(dashboard(path));
            await expect(page.getByRole("region", { name, exact: true })).toContainText(plan);
        }

        await page.goto(dashboard("programme"));
        await expect(
            page.getByRole("region", { name: "Programme", exact: true }),
        ).not.toContainText("Dès Essentiel");
    });

    test("chaque raccourci de la vue d'ensemble mène à sa page", async ({ page }) => {
        await page.goto(DASHBOARD);
        const shortcuts = page.getByRole("region", { name: "Tout le tableau de bord" });
        await expect(shortcuts).toContainText(
            "3 personnes · 1 invitation en attente · 1 invitation expirée",
        );

        await shortcuts.getByRole("link", { name: /^Plan de table/ }).click();
        await expect(page).toHaveURL(dashboard("plan-de-table"));
        await expect(page.getByRole("heading", { level: 1 })).toHaveText("Plan de table");
        await expect(page).toHaveTitle(/^Plan de table · démo/);
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

        await page.goto(dashboard("invites"));
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

    test("le détail d'un foyer s'ouvre sans clé React en double", async ({ page }) => {
        const duplicates: string[] = [];
        page.on("console", (message) => {
            if (message.type() === "error" && message.text().includes("same key"))
                duplicates.push(message.text());
        });
        await page.goto(dashboard("invites"));
        await page
            .getByRole("button", { name: "Voir la réponse de Marie & Thomas" })
            .first()
            .click();
        await expect(page.getByRole("dialog", { name: "Marie & Thomas" })).toBeVisible();

        expect(duplicates).toEqual([]);
    });

    test("ouvrir un détail laisse la navigation collée en haut de l'écran", async ({ page }) => {
        await page.goto(dashboard("invites"));
        /** The modal hides the page from assistive technology: found by its markup instead. */
        const navigation = page.locator('nav[aria-label="Sections du tableau de bord"]:visible');
        /** The last household of the list: the page has to scroll to reach it. */
        await page
            .getByRole("button", { name: /^Voir la réponse de/ })
            .filter({ visible: true })
            .last()
            .click();
        await expect(page.getByRole("dialog")).toBeVisible();

        const stuck = await navigation.evaluate((nav) => {
            const bar = nav.closest("aside, header") as HTMLElement;
            return { top: Math.round(bar.getBoundingClientRect().top), scrolled: window.scrollY };
        });
        expect(stuck.scrolled).toBeGreaterThan(0);
        expect(stuck.top).toBeCloseTo(0, 0);
    });

    test("le faire-part modifié par les mariés s'affiche chez les invités", async ({ page }) => {
        await page.goto(dashboard("faire-part"));
        const editor = page.getByRole("region", { name: "Votre faire-part" });
        await editor.getByLabel("Premier prénom").fill("Élise");
        await editor.getByRole("radio", { name: "Terre" }).check();
        await editor.getByRole("button", { name: "Enregistrer le faire-part" }).click();
        await expect(editor.getByRole("status")).toContainText("Enregistré");

        await page.goto("/mariage/demo");
        await expect(page.getByRole("dialog", { name: /Élise/ })).toBeVisible();
    });

    test("une photo agrandie peut être retirée de la galerie", async ({ page }) => {
        await page.goto(dashboard("galerie"));
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
        await page.goto(dashboard("programme"));
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
        await page.goto(dashboard("programme"));
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
        await page.goto(dashboard("faire-part"));
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
        await page.goto(dashboard("plan-de-table"));
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
        await page.goto(dashboard("plan-de-table"));
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

    test("l'entrée et la table des mariés pivotent pour longer un mur", async ({ page }) => {
        await page.goto(dashboard("plan-de-table"));
        const seating = page.getByRole("region", { name: "Plan de table · dîner" });

        await seating.getByRole("button", { name: /^Entrée/ }).click();
        await seating.getByRole("button", { name: "Pivoter l'entrée" }).click();
        await expect(
            seating.getByRole("button", { name: /^Entrée, le long d'un mur/ }),
        ).toBeVisible();

        await seating.getByRole("button", { name: /^Table des mariés/ }).focus();
        await page.keyboard.press("r");
        await page.reload();
        await expect(
            seating.getByRole("button", { name: /^Table des mariés, le long d'un mur/ }),
        ).toBeVisible();
        await expect(
            seating.getByRole("button", { name: /^Entrée, le long d'un mur/ }),
        ).toBeVisible();
    });

    test("un clic sur le bord d'une table la sélectionne sans la déplacer", async ({ page }) => {
        await page.goto(dashboard("plan-de-table"));
        const seating = page.getByRole("region", { name: "Plan de table · dîner" });
        const table = seating.getByRole("button", { name: /^Table 3,/ });
        await table.scrollIntoViewIfNeeded();
        const before = await table.getAttribute("transform");
        const box = (await table.boundingBox())!;

        /** A real press on the edge of the table, with the hand trembling a little. */
        await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.2 + 3, box.y + box.height * 0.5 + 2);
        await page.mouse.up();

        await expect(table).toHaveAttribute("aria-pressed", "true");
        expect(await table.getAttribute("transform")).toBe(before);
    });

    test("une table glissée garde le point saisi sous le pointeur", async ({ page }) => {
        await page.goto(dashboard("plan-de-table"));
        const seating = page.getByRole("region", { name: "Plan de table · dîner" });
        const table = seating.getByRole("button", { name: /^Table 3,/ });
        await table.scrollIntoViewIfNeeded();
        const box = (await table.boundingBox())!;
        const grab = { x: box.x + box.width * 0.25, y: box.y + box.height * 0.5 };

        await page.mouse.move(grab.x, grab.y);
        await page.mouse.down();
        await page.mouse.move(grab.x + 20, grab.y, { steps: 4 });
        await page.mouse.move(grab.x + 40, grab.y, { steps: 4 });
        await page.mouse.up();

        const after = (await table.boundingBox())!;
        expect(after.x - box.x).toBeCloseTo(40, -1);
        expect(after.y - box.y).toBeCloseTo(0, -1);
        await expect(table).toHaveAttribute("aria-pressed", "false");
    });

    test("plusieurs tables se sélectionnent avec Ctrl ou ⌘ et se retirent d'un coup", async ({
        page,
    }) => {
        await page.goto(dashboard("plan-de-table"));
        const seating = page.getByRole("region", { name: "Plan de table · dîner" });

        await seating.getByRole("button", { name: /^Table 7,/ }).click();
        await seating
            .getByRole("button", { name: /^Table 8,/ })
            .click({ modifiers: ["ControlOrMeta"] });
        const selection = seating.getByRole("region", { name: "2 tables sélectionnées" });
        await selection.getByRole("button", { name: "Retirer les 2 tables" }).click();
        await page
            .getByRole("dialog", { name: "Retirer les 2 tables ?" })
            .getByRole("button", { name: "Retirer" })
            .click();

        await expect(seating.getByRole("button", { name: /^Table [78],/ })).toHaveCount(0);
        await expect(seating.getByRole("button", { name: /^Table 6,/ })).toBeVisible();
    });

    test("toutes les tables se retirent d'un coup, leurs invités repassent sans table", async ({
        page,
    }) => {
        await page.goto(dashboard("plan-de-table"));
        const seating = page.getByRole("region", { name: "Plan de table · dîner" });

        await seating.getByRole("button", { name: "Retirer toutes les tables" }).click();
        const confirm = page.getByRole("dialog", { name: "Retirer les 8 tables ?" });
        await expect(confirm).toContainText("Leurs 20 invités repasseront « sans table ».");
        await confirm.getByRole("button", { name: "Tout retirer" }).click();

        await expect(seating.getByRole("button", { name: /^Table \d+,/ })).toHaveCount(0);
        await expect(seating).toContainText("0 placés");
    });

    test("une très grande salle tient dans sa colonne, sans défilement horizontal", async ({
        page,
        isMobile,
    }) => {
        test.skip(isMobile, "sur téléphone, une grande salle garde une largeur où toucher");
        await page.goto(dashboard("plan-de-table"));
        const seating = page.getByRole("region", { name: "Plan de table · dîner" });
        await seating.getByLabel("Taille").selectOption("xl");

        const plan = seating.getByRole("group", { name: /^Plan de la salle/ });
        await expect(plan).toBeVisible();
        const overflow = await plan.evaluate((svg) => {
            const scroller = svg.closest(".overflow-x-auto") as HTMLElement;
            return scroller.scrollWidth - scroller.clientWidth;
        });
        expect(overflow).toBeLessThanOrEqual(0);
    });

    test("le menu se replie en icônes, nommées au survol", async ({ page, isMobile }) => {
        test.skip(isMobile, "le menu latéral n'existe que sur grand écran");
        await page.goto(DASHBOARD);
        const menu = page.getByRole("navigation", { name: "Sections du tableau de bord" });

        await page.getByRole("button", { name: "Replier le menu" }).click();
        const guests = menu.getByRole("link", { name: "Invités" });
        await expect
            .poll(() => menu.evaluate((nav) => nav.closest("aside")!.offsetWidth))
            .toBeLessThan(100);

        await guests.hover();
        await expect(page.getByRole("tooltip", { name: "Invités" })).toBeVisible();

        await page.reload();
        await expect(page.getByRole("button", { name: "Déplier le menu" })).toBeVisible();
    });

    test("chaque entrée du menu ouvre sa page et s'allume", async ({ page, isMobile }) => {
        test.skip(isMobile, "le menu latéral n'existe que sur grand écran");
        await page.goto(DASHBOARD);
        const menu = page.getByRole("navigation", { name: "Sections du tableau de bord" });
        const current = menu.locator('[aria-current="page"]');
        await expect(current).toHaveAccessibleName(/Vue d'ensemble/);

        for (const link of await menu.getByRole("link").all()) {
            const href = (await link.getAttribute("href")) ?? "";
            await link.click();
            await expect(page).toHaveURL(href);
            await expect(current, href).toHaveAttribute("href", href);
            await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        }
    });

    test("sur téléphone, l'onglet de la page ouverte se place dans la barre", async ({
        page,
        isMobile,
    }) => {
        test.skip(!isMobile, "la barre défilante n'existe que sur mobile");
        await page.goto(dashboard("acces"));
        const strip = page.locator('header nav[aria-label="Sections du tableau de bord"] ul');
        await expect(strip.locator('[aria-current="page"]')).toHaveAccessibleName("Accès");
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

    test("le récap traiteur s'exporte en PDF", async ({ page }) => {
        await page.goto(DASHBOARD);
        const caterer = page.getByRole("region", { name: "Récap traiteur · dîner" });
        const [download] = await Promise.all([
            page.waitForEvent("download"),
            caterer.getByRole("button", { name: "Exporter le récap traiteur en PDF" }).click(),
        ]);

        expect(download.suggestedFilename()).toBe("recap-traiteur-camille-hugo-diner.pdf");
        const pdf = await readFile((await download.path()) ?? "");
        expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    });

    test("le faire-part s'imprime en PDF, le même pour tous ou un par foyer", async ({ page }) => {
        await page.goto(dashboard("faire-part"));
        const print = page.getByRole("region", { name: "Faire-part à imprimer" });
        await expect(
            print.getByRole("img", { name: "QR code du faire-part : ouvre le site du mariage" }),
        ).toBeVisible();
        await expect(print).toContainText("Signature · option Intime et Essentiel");

        const [shared] = await Promise.all([
            page.waitForEvent("download"),
            print.getByRole("button", { name: "Le faire-part en PDF" }).click(),
        ]);
        expect(shared.suggestedFilename()).toBe("faire-part-camille-hugo.pdf");
        const pdf = await readFile((await shared.path()) ?? "");
        expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");

        const [perHousehold] = await Promise.all([
            page.waitForEvent("download"),
            print.getByRole("button", { name: /^Les \d+ faire-part en PDF$/ }).click(),
        ]);
        expect(perHousehold.suggestedFilename()).toBe("faire-part-par-foyer-camille-hugo.pdf");
    });

    test("le détail d'un foyer montre son QR personnel et son faire-part à imprimer", async ({
        page,
    }) => {
        await page.goto(dashboard("invites"));
        await page
            .getByRole("button", { name: "Voir la réponse de Marie & Thomas" })
            .first()
            .click();

        const paper = page
            .getByRole("dialog", { name: "Marie & Thomas" })
            .getByRole("region", { name: "Son faire-part papier" });
        await expect(
            paper.getByRole("img", { name: "QR code personnel de Marie & Thomas" }),
        ).toBeVisible();
        const [download] = await Promise.all([
            page.waitForEvent("download"),
            paper.getByRole("button", { name: "Son faire-part PDF" }).click(),
        ]);
        expect(download.suggestedFilename()).toBe("faire-part-marie-thomas.pdf");
    });

    test("chaque QR code du jour J n'ouvre que sa page, et s'imprime en affiche", async ({
        page,
    }) => {
        const cases = [
            [
                "plan-de-table",
                "QR code du plan de table",
                /\/mariage\/demo\/plan-de-table$/,
                "Affiche du plan de table",
                "affiche-plan-de-table-camille-hugo.pdf",
            ],
            [
                "galerie",
                "QR code de la galerie",
                /\/mariage\/demo\/galerie$/,
                "Affiche et cartes de table",
                "affiche-galerie-camille-hugo.pdf",
            ],
        ] as const;
        for (const [path, name, href, button, filename] of cases) {
            await page.goto(dashboard(path));
            const card = page.getByRole("region", { name, exact: true });
            await expect(card.getByRole("link", { name: /^Ouvrir/ })).toHaveAttribute("href", href);
            const [download] = await Promise.all([
                page.waitForEvent("download"),
                card.getByRole("button", { name: button }).click(),
            ]);
            expect(download.suggestedFilename()).toBe(filename);
        }
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

    test("une personne invitée reçoit les accès choisis fonction par fonction", async ({
        page,
    }) => {
        await page.goto(dashboard("acces"));
        const access = page.getByRole("region", { name: "Accès au tableau de bord" });

        await access.getByRole("button", { name: "Inviter une personne" }).click();
        const dialog = page.getByRole("dialog", { name: "Inviter une personne" });
        await dialog.getByLabel("Prénom").fill("Nina");
        await dialog.getByLabel("E-mail").fill("elsa.marchand@exemple.fr");
        await dialog.getByRole("button", { name: "Wedding planner" }).click();
        await expect(dialog).not.toContainText("Ajusté");
        await dialog.getByRole("radiogroup", { name: "Relances" }).getByText("Voir").click();
        await expect(dialog.getByRole("button", { name: "Wedding planner" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
        await expect(dialog).toContainText("Ajusté");

        await dialog.getByRole("radiogroup", { name: "Invités" }).getByText("Masqué").click();
        await expect(
            dialog.getByRole("radiogroup", { name: "Régimes et allergies" }).getByRole("radio"),
        ).toHaveCount(2);
        for (const radio of await dialog
            .getByRole("radiogroup", { name: "Régimes et allergies" })
            .getByRole("radio")
            .all())
            await expect(radio).toBeDisabled();
        await dialog.getByRole("radiogroup", { name: "Invités" }).getByText("Voir").click();

        await dialog.getByRole("button", { name: "Envoyer l'invitation" }).click();
        await expect(dialog).toContainText("Cette adresse a déjà un accès.");
        await dialog.getByLabel("E-mail").fill("nina@exemple.fr");
        await dialog.getByRole("button", { name: "Envoyer l'invitation" }).click();

        await expect(dialog.getByRole("status")).toContainText("Invitation envoyée à Nina");
        await dialog.getByRole("button", { name: "Terminé" }).click();
        const nina = access.getByRole("listitem").filter({ hasText: "nina@exemple.fr" });
        await expect(nina).toContainText(/Invitation expire dans \d j/);
        await expect(nina).toContainText("Voit : invités, relances");
        await expect(nina).not.toContainText("régimes");
        await page.goto(DASHBOARD);
        await expect(page.getByRole("region", { name: "Activité récente" })).toContainText(
            "Invitation envoyée à Nina",
        );
    });

    test("la galerie et les tables ouvrent au jour et à l'heure choisis", async ({ page }) => {
        await page.goto(`${dashboard("programme")}#dates`);
        const dates = page.getByRole("form", { name: "Dates clés" });

        await expect(dates.getByLabel("Ouverture de la galerie", { exact: true })).toHaveValue(
            "2027-06-11",
        );
        await expect(dates.getByLabel("Affichage des tables, heure")).toHaveValue("10:00");
        await dates.getByLabel("Affichage des tables, heure").fill("19:30");
        await dates.getByLabel("Ouverture de la galerie, heure").fill("18:00");
        await dates.getByRole("button", { name: "Enregistrer les dates" }).click();
        await expect(dates.getByRole("status")).toContainText("Enregistrées");

        await page.goto(dashboard("plan-de-table"));
        await expect(page.getByRole("main")).toContainText(
            "Tables dévoilées le samedi 12 juin à 19 h 30",
        );
        await page.goto(dashboard("galerie"));
        await expect(page.getByRole("main")).toContainText("vendredi 11 juin à 18 h");
    });

    test("une ouverture hors de la semaine du mariage est refusée", async ({ page }) => {
        await page.goto(`${dashboard("programme")}#dates`);
        const dates = page.getByRole("form", { name: "Dates clés" });

        await dates.getByLabel("Affichage des tables", { exact: true }).fill("2027-06-13");
        await dates.getByRole("button", { name: "Enregistrer les dates" }).click();
        await expect(dates).toContainText("Dans la semaine qui précède le mariage");
    });

    test("les accès d'une personne se modifient, et se retirent", async ({ page }) => {
        await page.goto(dashboard("acces"));
        const access = page.getByRole("region", { name: "Accès au tableau de bord" });

        await access.getByRole("button", { name: "Modifier les accès d'Elsa" }).click();
        const dialog = page.getByRole("dialog", { name: "Accès d'Elsa" });
        await expect(dialog.getByLabel("E-mail")).toBeDisabled();
        await dialog.getByRole("radiogroup", { name: "Programme" }).getByText("Modifier").click();
        await dialog.getByRole("button", { name: "Enregistrer les accès" }).click();
        await expect(dialog).toBeHidden();
        await expect(access.getByRole("listitem").filter({ hasText: "Elsa" })).toContainText(
            "Modifie : programme, plan de table, galerie",
        );

        await access.getByRole("button", { name: "Retirer l'accès de Malik" }).click();
        await page
            .getByRole("dialog", { name: "Retirer l'accès de Malik ?" })
            .getByRole("button", { name: "Retirer l'accès" })
            .click();
        await expect(access).not.toContainText("malik.benali@exemple.fr");
        await page.goto(DASHBOARD);
        await expect(page.getByRole("region", { name: "Activité récente" })).toContainText(
            "Accès de Malik retiré",
        );
    });
});
