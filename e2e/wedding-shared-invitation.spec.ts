import { expect, test } from "@playwright/test";

const SHARED = "/mariage/demo?commun";

test.describe("faire-part commun : le QR pour tous", () => {
    test("le QR du faire-part commun ouvre le site sans foyer, pas celui de Marie & Thomas", async ({
        page,
        baseURL,
    }) => {
        /** The package ships ES modules only: loaded as one, not required. */
        const { qrCode } = await import("@alexreu/wedding-core/prints");
        await page.goto("/mariage/demo/tableau-de-bord/faire-part");
        const qr = page.getByRole("img", { name: /QR code du faire-part/ });

        await expect(qr.locator("path")).toHaveAttribute(
            "d",
            qrCode(`${baseURL}${SHARED}`, { border: 2 }).path,
        );
    });

    test("le faire-part commun n'est adressé à personne, et ne laisse répondre pour personne", async ({
        page,
    }) => {
        await page.goto(SHARED);

        await expect(page.getByText("Vous êtes invités")).toBeVisible();
        await expect(page.getByText("Marie & Thomas")).toHaveCount(0);
        await page.getByRole("button", { name: "Ouvrir le faire-part" }).click();

        await expect(page.getByRole("form", { name: "Votre réponse" })).toHaveCount(0);
        await expect(page.getByRole("region", { name: "Serez-vous des nôtres ?" })).toContainText(
            "lien personnel",
        );
    });

    test("on retrouve son foyer par son nom, et le lien part à l'adresse notée par les mariés", async ({
        page,
    }) => {
        await page.goto(`${SHARED}&skip`);
        const search = page.getByLabel("Votre prénom ou votre nom");

        await search.fill("Thomas");
        await page.getByRole("button", { name: /Marie & Thomas/ }).click();
        await expect(page.getByRole("status")).toContainText(
            "Votre lien personnel part à m•••@exemple.fr",
        );

        await search.fill("Jeanne");
        await page.getByRole("button", { name: /Mamie Jeanne/ }).click();
        await expect(page.getByRole("status")).toContainText("demandez votre lien aux mariés");

        await page.goto("/mariage/demo/tableau-de-bord");
        await expect(page.getByRole("region", { name: "Activité récente" })).toContainText(
            "Marie & Thomas a demandé son lien",
        );
    });
});
