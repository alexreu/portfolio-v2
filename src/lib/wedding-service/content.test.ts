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
});
