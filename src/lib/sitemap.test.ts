import { describe, expect, it } from "vitest";

import { sitemapEntries } from "./sitemap";

const input = { images: [], lastContentUpdate: "2026-10-01T10:00:00Z", weddingUpdatedAt: null };

describe("sitemapEntries", () => {
    it("lists the wedding offer page and its demos for search engines", () => {
        const urls = sitemapEntries(input).map((entry) => entry.url);

        expect(urls).toEqual(
            expect.arrayContaining([
                "https://alexdevlab.com/mariage",
                "https://alexdevlab.com/mariage/demo",
                "https://alexdevlab.com/mariage/demo/tableau-de-bord",
            ]),
        );
    });

    it("keeps the homepage and the legal pages", () => {
        const urls = sitemapEntries(input).map((entry) => entry.url);

        expect(urls).toEqual(
            expect.arrayContaining([
                "https://alexdevlab.com/",
                "https://alexdevlab.com/mentions-legales",
                "https://alexdevlab.com/politique-de-confidentialite",
                "https://alexdevlab.com/politique-de-cookies",
            ]),
        );
    });

    it("dates the offer page even before its document is published in the Studio", () => {
        const offer = sitemapEntries(input).find((entry) => entry.url.endsWith("/mariage"));

        expect(offer?.lastModified).toBe("2026-10-08");
    });
});
