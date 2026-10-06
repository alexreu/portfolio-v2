import { defaultWeddingService } from "@/content/wedding-service";
import { describe, expect, it } from "vitest";

import { weddingLlmsSection } from "./llms";

describe("weddingLlmsSection", () => {
    it("lists the wedding plans at their net price, without the HT label used for business offers", () => {
        const section = weddingLlmsSection(defaultWeddingService);

        expect(section).toContain("## Sites de mariage");
        expect(section).toContain("- Intime : 290 €");
        expect(section).toContain("- Signature : 990 €");
        expect(section).not.toContain("HT");
        expect(section).toContain("TVA non applicable, art. 293 B du CGI");
    });

    it("points AI crawlers to the offer page and the demo", () => {
        const section = weddingLlmsSection(defaultWeddingService);

        expect(section).toContain("https://alexdevlab.com/mariage");
        expect(section).toContain("https://alexdevlab.com/mariage/demo");
    });
});
