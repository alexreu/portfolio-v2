import { defaultWeddingService } from "@/content/wedding-service";
import { describe, expect, it } from "vitest";

import { resolveWeddingService } from "./content";

describe("resolveWeddingService", () => {
    it("shows the default content until the document is published in Sanity", () => {
        expect(resolveWeddingService(null)).toEqual(defaultWeddingService);
    });

    it("keeps published sections and falls back for a section left empty in the Studio", () => {
        const published = {
            ...defaultWeddingService,
            hero: { ...defaultWeddingService.hero, lead: "Texte publié" },
            pricing: { ...defaultWeddingService.pricing, plans: [] },
        };

        const resolved = resolveWeddingService(published);

        expect(resolved.hero.lead).toBe("Texte publié");
        expect(resolved.pricing.plans).toEqual(defaultWeddingService.pricing.plans);
    });

    it("keeps the default photo while the one in the Studio is not uploaded yet", () => {
        const published = {
            ...defaultWeddingService,
            about: {
                ...defaultWeddingService.about,
                heading: { text: "Texte publié" },
                photo: { src: null, alt: "" },
            },
        };

        const { about } = resolveWeddingService(published);

        expect(about.heading.text).toBe("Texte publié");
        expect(about.photo).toEqual(defaultWeddingService.about.photo);
    });

    it("shows the photo uploaded in the Studio once it is there", () => {
        const photo = { src: "https://cdn.sanity.io/images/x/production/a.webp", alt: "Alexandre" };
        const published = {
            ...defaultWeddingService,
            about: { ...defaultWeddingService.about, photo },
        };

        expect(resolveWeddingService(published).about.photo).toEqual(photo);
    });
});
