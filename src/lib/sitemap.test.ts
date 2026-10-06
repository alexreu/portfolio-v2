import { describe, expect, it } from "vitest";

import { sitemapEntries } from "./sitemap";

const input = { images: [], lastContentUpdate: "2026-10-01T10:00:00Z", weddingUpdatedAt: null };

describe("sitemapEntries", () => {
    it("lists the wedding offer page and its demo for search engines", () => {
        const urls = sitemapEntries(input).map((entry) => entry.url);

        expect(urls).toEqual(
            expect.arrayContaining([
                "https://alexdevlab.com/mariage",
                "https://alexdevlab.com/mariage/demo",
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
});
