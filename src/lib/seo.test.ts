import { defaultWeddingService } from "@/content/wedding-service";
import { describe, expect, it } from "vitest";

import { buildWeddingJsonLd } from "./seo";

type Node = { "@type": string; [key: string]: unknown };

const nodeOfType = (type: string) =>
    (buildWeddingJsonLd(defaultWeddingService)["@graph"] as Node[]).find(
        (node) => node["@type"] === type,
    );

describe("buildWeddingJsonLd", () => {
    it("declares the wedding website service with each plan as an offer in euros", () => {
        expect(nodeOfType("Service")?.offers).toEqual([
            expect.objectContaining({ name: "Intime", price: "290", priceCurrency: "EUR" }),
            expect.objectContaining({ name: "Essentiel", price: "490", priceCurrency: "EUR" }),
            expect.objectContaining({ name: "Signature", price: "890", priceCurrency: "EUR" }),
        ]);
    });

    it("exposes every FAQ entry as a question with its accepted answer", () => {
        const faq = nodeOfType("FAQPage")?.mainEntity as Node[];

        expect(faq).toHaveLength(defaultWeddingService.faq.items.length);
        expect(faq[0]).toEqual({
            "@type": "Question",
            name: "Et si un invité n'a pas de smartphone ?",
            acceptedAnswer: {
                "@type": "Answer",
                text: defaultWeddingService.faq.items[0].answer,
            },
        });
    });

    it("places the page in the site breadcrumb trail", () => {
        expect(nodeOfType("BreadcrumbList")?.itemListElement).toEqual([
            expect.objectContaining({ position: 1, name: "Accueil" }),
            expect.objectContaining({ position: 2, name: "Sites de mariage sur-mesure" }),
        ]);
    });
});
