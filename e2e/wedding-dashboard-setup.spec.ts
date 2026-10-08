import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

const DASHBOARD = "/mariage/demo/tableau-de-bord";
const dashboard = (page = "") => (page ? `${DASHBOARD}/${page}` : DASHBOARD);

const notice = (page: Page) => page.getByRole("complementary", { name: "À propos de cette démo" });

test.describe("tableau de bord des mariés (démo) · formules, import, réglages, connexion", () => {
    test("la démo joue la formule choisie, menu et pages compris", async ({ page, isMobile }) => {
        await page.goto(dashboard());
        await notice(page).getByLabel("Formule").selectOption({ label: "Intime" });

        const menu = page
            .getByRole("navigation", { name: "Sections du tableau de bord" })
            .filter({ visible: true });
        await expect(menu.getByRole("link", { name: /Invités/ })).toBeVisible();
        await expect(menu.getByRole("link", { name: /Plan de table/ })).toHaveCount(0);
        await expect(menu.getByRole("link", { name: /Relances/ })).toHaveCount(0);

        await page.goto(dashboard("plan-de-table"));
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            "Cette page n'est pas dans la formule Intime",
        );
        await page.getByRole("button", { name: "Voir la formule Signature" }).click();
        await expect(page.getByRole("heading", { level: 1 })).toHaveText("Plan de table");
        test.skip(isMobile, "le sous-titre du menu n'existe que sur grand écran");
        await expect(page.getByText(/· Signature$/).first()).toBeVisible();
    });

    test("Intime ne montre ni galerie, ni tables, ni relance, même dans les dates et la vue d'ensemble", async ({
        page,
    }) => {
        await page.goto(dashboard());
        await notice(page).getByLabel("Formule").selectOption({ label: "Intime" });
        await expect(page.getByLabel("Indicateurs")).toContainText("Liens ouverts");
        await expect(page.getByRole("main")).not.toContainText(
            /Galerie photos|Relance automatique/,
        );

        await page.goto(dashboard("programme"));
        const dates = page.getByRole("form", { name: "Dates clés" });
        await expect(dates.getByLabel("Date limite des réponses")).toBeVisible();
        await expect(dates).not.toContainText(
            /Ouverture de la galerie|Affichage des tables|Relance automatique/,
        );

        await notice(page).getByLabel("Formule").selectOption({ label: "Signature" });
        await expect(dates.getByLabel("Ouverture de la galerie", { exact: true })).toBeVisible();
        await expect(dates.getByLabel("Affichage des tables", { exact: true })).toBeVisible();
    });

    test("une adresse avec ?formule= ouvre le site invité dans cette formule", async ({ page }) => {
        await page.goto("/mariage/demo?skip&formule=intime");
        await expect(page.getByRole("region", { name: "Dress code" })).toBeVisible();
        await expect(page.getByLabel("Compte à rebours")).toHaveCount(0);
        await expect(page.locator("#photos")).toHaveCount(0);
        await page.goto("/mariage/demo?skip&apres&formule=intime");
        await expect(page.getByText(/^Merci d'avoir été là/).first()).toBeVisible();
        await expect(page.getByRole("main")).not.toContainText("photos de la journée");

        await page.goto("/mariage/demo?skip&formule=signature");
        await expect(page.getByLabel("Compte à rebours")).toBeVisible();
        await expect(page.locator("#photos")).toHaveCount(1);
    });

    test("le lien personnel se renvoie à la main, et l'activité le note", async ({ page }) => {
        await page.goto(dashboard("invites"));
        await page.getByRole("button", { name: "Marie & Thomas" }).first().click();
        const detail = page.getByRole("dialog", { name: "Marie & Thomas" });

        await detail.getByRole("button", { name: "Renvoyer son lien" }).click();
        await expect(detail.getByText("Lien renvoyé à marie.lefevre@exemple.fr")).toBeVisible();
        await page.goto(dashboard());
        await expect(page.getByRole("region", { name: "Activité récente" })).toContainText(
            "Lien renvoyé à Marie & Thomas",
        );
    });

    test("une liste d'invités s'importe d'un coup, les lignes à corriger signalées", async ({
        page,
    }) => {
        await page.goto(dashboard("invites"));
        await page.getByRole("button", { name: "Importer une liste" }).click();
        const dialog = page.getByRole("dialog", { name: "Importer une liste" });

        await dialog
            .getByLabel("Ou collez la liste")
            .fill(
                [
                    "Foyer;Prénom;Enfant;Groupe",
                    "Famille Roux;Anne;non;Amis",
                    "Famille Roux;Tom;oui;Amis",
                    "Famille Blanc;Yves;;Rugby",
                ].join("\n"),
            );
        await expect(dialog).toContainText("1 foyer · 2 invités prêts à importer");
        await expect(dialog).toContainText("Ligne 4 : le groupe « Rugby » n'existe pas");

        await dialog.getByRole("button", { name: "Importer 1 foyer" }).click();
        await expect(dialog.getByRole("status")).toContainText("1 foyer importé");
        await dialog.getByRole("button", { name: "Voir la liste" }).click();
        await expect(page.getByRole("region", { name: "Foyers invités" })).toContainText(
            "Famille Roux",
        );
    });

    test("les réglages changent les groupes, le lieu du mariage, et donnent toutes les données", async ({
        page,
    }) => {
        await page.goto(dashboard("reglages"));

        const groups = page.getByRole("form", { name: "Groupes d'invités" });
        await groups.getByRole("textbox").first().fill("Famille de Camille");
        await groups.getByRole("button", { name: "Enregistrer les groupes" }).click();
        await expect(groups.getByRole("status")).toContainText("Groupes enregistrés.");

        const place = page.getByRole("form", { name: "Lieu du mariage" });
        await expect(page.getByLabel(/Adresse du site|Contact des invités/)).toHaveCount(0);
        await place.getByLabel("Fuseau horaire").selectOption({ label: "La Réunion" });
        await place.getByRole("button", { name: "Enregistrer" }).click();
        await expect(place.getByRole("status")).toContainText("Enregistré");

        const [download] = await Promise.all([
            page.waitForEvent("download"),
            page.getByRole("button", { name: "Télécharger toutes vos données" }).click(),
        ]);
        expect(download.suggestedFilename()).toMatch(/^donnees-camille-hugo-.*\.json$/);
        const exported = JSON.parse(await readFile((await download.path()) ?? "", "utf8"));
        expect(exported.wedding.timezone).toBe("Indian/Reunion");
        expect(exported.wedding.settings.domain).toBe("camille-et-hugo.fr");
        expect(exported.wedding.groups[0].label).toBe("Famille de Camille");
    });

    test("la connexion répond pareil à toute adresse, et le lien ouvre la vue de la personne", async ({
        page,
    }) => {
        await page.goto("/mariage/demo/connexion");
        await page.getByLabel("Votre adresse e-mail").fill("inconnu@exemple.fr");
        await page.getByRole("button", { name: "Recevoir le lien" }).click();
        await expect(page.getByRole("status")).toContainText("Si cette adresse est connue");
        await expect(page.getByText("aucun compte pour cette adresse")).toBeVisible();

        await page.getByRole("button", { name: "Utiliser une autre adresse" }).click();
        await page.getByLabel("Votre adresse e-mail").fill("agathe@atelier-agathe.exemple.fr");
        await page.getByRole("button", { name: "Recevoir le lien" }).click();
        await expect(page.getByRole("status")).toContainText("Si cette adresse est connue");
        await page.getByRole("button", { name: "Ouvrir le lien" }).click();

        await expect(page).toHaveURL(/tableau-de-bord\?vue=/);
        await expect(notice(page).getByLabel("Voir en tant que")).toHaveValue("agathe");
        await page.goto(dashboard("acces"));
        await notice(page).getByLabel("Voir en tant que").selectOption("");
        await expect(
            page
                .getByRole("region", { name: "Accès au tableau de bord" })
                .getByRole("listitem")
                .filter({ hasText: "Agathe" }),
        ).toContainText("A rejoint");
    });
});
