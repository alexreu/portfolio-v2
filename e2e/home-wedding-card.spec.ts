import { expect, test, type APIRequestContext } from "@playwright/test";

/** Fonts preloaded by the served HTML: the browser adds the router prefetches' own afterwards. */
const preloadedFonts = async (request: APIRequestContext, path: string) => {
    const html = await (await request.get(path)).text();
    return [...html.matchAll(/<link rel="preload" href="([^"]+)" as="font"/g)]
        .map(([, href]) => href)
        .sort();
};

test("la carte « Sites de mariage » de la home mène à l'offre", async ({ page }) => {
    await page.goto("/");
    const card = page.getByRole("region", { name: /Votre mariage mérite mieux/ });

    await expect(card).toContainText("dès 290 €");
    await card.getByRole("link", { name: "Découvrir l'offre" }).click();

    await expect(page).toHaveURL(/\/mariage$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Un site à votre image");
});

test("la home ne précharge pas les polices du mariage", async ({ request }) => {
    const plainPageFonts = await preloadedFonts(request, "/mentions-legales");

    expect(plainPageFonts.length).toBeGreaterThan(0);
    expect(await preloadedFonts(request, "/")).toEqual(plainPageFonts);
});

test("les boutons de la carte mariage ont la forme et la couleur des autres boutons", async ({
    page,
}) => {
    await page.goto("/");
    const look = (name: string) =>
        page.getByRole("link", { name, exact: true }).evaluate((link) => {
            const style = getComputedStyle(link);
            return { radius: style.borderTopLeftRadius, color: style.color };
        });

    expect(await look("Découvrir l'offre")).toEqual(await look("Discutons-en"));
    expect(await look("Voir le site démo")).toEqual(await look("Découvrir les tarifs"));
});
