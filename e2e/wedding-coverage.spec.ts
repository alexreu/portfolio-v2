import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

const DASHBOARD = "/mariage/demo/tableau-de-bord";

const dashboard = (page = "") => (page ? `${DASHBOARD}/${page}` : DASHBOARD);

/** "YYYY-MM-DD", `days` from today. */
const inDays = (days: number) =>
    new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

const addBrunchForEveryone = async (page: Page) => {
    await page.goto(dashboard("programme"));
    const programme = page.getByRole("region", { name: "Programme" });
    await programme.getByRole("button", { name: "Ajouter un moment" }).click();
    const dialog = page.getByRole("dialog", { name: "Nouveau moment" });
    await dialog.getByLabel("Nom du moment").fill("Pique-nique");
    await dialog.getByLabel("Intitulé").fill("Pique-nique du dimanche");
    await dialog.getByLabel("Lieu").fill("Parc du château");
    await dialog.getByLabel("Date", { exact: true }).fill("2027-06-13");
    await dialog.getByLabel("Début").fill("12:00");
    await dialog.getByRole("button", { name: "Ajouter le moment" }).click();
    await expect(programme).toContainText("Pique-nique du dimanche");
};

test.describe("cas limites du site et du tableau de bord (démo)", () => {
    test("un moment ajouté après une réponse se complète, et le foyer est relancé", async ({
        page,
    }) => {
        await addBrunchForEveryone(page);

        await page.goto(dashboard("invites"));
        const list = page.getByRole("region", { name: "Foyers invités" });
        await expect(list.getByRole("button", { name: /^À compléter/ })).toBeVisible();

        await page.goto("/mariage/demo?foyer=moreau&skip");
        const form = page.getByRole("form", { name: "Votre réponse" });
        await expect(form.getByRole("status")).toContainText("il reste à nous dire");
        await expect(form.getByRole("group", { name: /^Claire, Pique-nique/ })).toBeVisible();
    });

    test("passée la date limite, le site ne prend plus de réponse", async ({ page }) => {
        await page.goto(dashboard("programme"));
        const dates = page.getByRole("region", { name: "Dates clés" });
        await dates.getByLabel("Date du mariage").fill(inDays(20));
        await dates.getByRole("button", { name: "Enregistrer les dates" }).click();

        await page.goto("/mariage/demo?skip");
        await expect(page.getByRole("form", { name: "Votre réponse" })).toHaveCount(0);
        await expect(page.locator("#rsvp")).toContainText("Les réponses sont closes");
    });

    test("le lendemain, le site remercie avec le message des mariés", async ({ page }) => {
        await page.goto(dashboard("faire-part"));
        const editor = page.getByRole("region", { name: "Votre faire-part" });
        await editor.getByLabel(/^Message du lendemain/).fill("Merci pour cette journée folle !");
        await editor.getByRole("button", { name: "Enregistrer le faire-part" }).click();

        await page.goto("/mariage/demo?apres");
        await expect(page.getByRole("heading", { level: 1, name: "Merci" })).toBeVisible();
        await expect(page.getByText("Merci pour cette journée folle !")).toBeVisible();
        await expect(page.getByRole("form", { name: "Votre réponse" })).toHaveCount(0);
    });

    test("le programme s'ajoute à l'agenda de l'invité", async ({ page }) => {
        await page.goto("/mariage/demo?skip");
        const [download] = await Promise.all([
            page.waitForEvent("download"),
            page.getByRole("button", { name: "Ajouter à mon agenda" }).click(),
        ]);

        expect(download.suggestedFilename()).toBe("mariage-camille-hugo.ics");
        const file = await readFile((await download.path()) ?? "", "utf8");
        expect(file).toContain("BEGIN:VCALENDAR");
        expect(file).toContain("SUMMARY:Mariage de Camille & Hugo");
    });

    test("les photos de la galerie se téléchargent en une archive", async ({ page }) => {
        /** No real download from Pexels during the test: a tiny image stands for each photo. */
        await page.route("https://images.pexels.com/**", (route) =>
            route.fulfill({
                status: 200,
                contentType: "image/jpeg",
                headers: { "access-control-allow-origin": "*" },
                body: Buffer.from([0xff, 0xd8, 0xff, 0xd9]),
            }),
        );
        await page.goto(dashboard("galerie"));
        const [download] = await Promise.all([
            page.waitForEvent("download"),
            page.getByRole("button", { name: "Tout télécharger (ZIP)" }).click(),
        ]);

        expect(download.suggestedFilename()).toBe("photos-camille-hugo.zip");
        const zip = await readFile((await download.path()) ?? "");
        expect(zip.subarray(0, 2).toString()).toBe("PK");
    });

    test("vu par une témoin, le tableau de bord ne montre que ce qui lui est ouvert", async ({
        page,
        isMobile,
    }) => {
        test.skip(isMobile, "le menu latéral n'existe que sur grand écran");
        await page.goto(dashboard("invites"));
        await page
            .getByLabel("Voir en tant que")
            .selectOption({ label: "Elsa · Témoin de Camille" });

        await expect(page.getByRole("link", { name: /^Accès/ })).toHaveCount(0);
        await expect(page.getByRole("link", { name: /^Relances/ })).toHaveCount(0);
        await expect(page.getByRole("link", { name: /^Plan de table/ }).first()).toBeVisible();
        await expect(
            page.getByRole("region", { name: "Foyers invités" }).getByRole("button", {
                name: "Créer un faire-part",
            }),
        ).toHaveCount(0);

        await page
            .getByRole("button", { name: "Voir la réponse de Famille Moreau" })
            .first()
            .click();
        const detail = page.getByRole("dialog", { name: "Famille Moreau" });
        await expect(detail.getByRole("button", { name: "Modifier le foyer" })).toHaveCount(0);
        await expect(detail).not.toContainText("Régime");
    });

    test("le lien de la démo s'annonce avec le faire-part, pas la carte du studio", async ({
        request,
    }) => {
        const html = await (await request.get("/mariage/demo")).text();
        expect(html).toMatch(/property="og:image" content="[^"]*\/mariage\/demo\/partage"/);

        const image = await request.get("/mariage/demo/partage");
        expect(image.status()).toBe(200);
        expect(image.headers()["content-type"]).toBe("image/png");
    });
});
