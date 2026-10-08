import { defaultWeddingService } from "@/content/wedding-service";
import { describe, expect, it } from "vitest";

import { buildPageMetadata, buildWeddingJsonLd, weddingPage } from "./seo";

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

    it("dates the page with the offer's content, not the legal pages'", () => {
        expect(nodeOfType("WebPage")?.dateModified).toBe("2026-10-08");
    });

    it("places the page in the site breadcrumb trail", () => {
        expect(nodeOfType("BreadcrumbList")?.itemListElement).toEqual([
            expect.objectContaining({ position: 1, name: "Accueil" }),
            expect.objectContaining({ position: 2, name: "Sites de mariage" }),
        ]);
    });

    it("shows the person behind the offer with the photo of the « Qui suis-je » section", () => {
        expect(nodeOfType("Person")).toMatchObject({
            name: "Alexandre Adolphe",
            image: "https://alexdevlab.com/images/wedding/alexandre-adolphe.webp",
        });
    });
});

describe("weddingPage metadata", () => {
    const metadata = buildPageMetadata(weddingPage);

    it("shares the offer with its own image, described for whoever cannot see it", () => {
        expect(metadata.openGraph?.images).toEqual([
            expect.objectContaining({
                url: "/mariage/partage",
                width: 1200,
                height: 630,
                alt: expect.stringContaining("site de mariage"),
            }),
        ]);
        expect(metadata.twitter?.images).toEqual(["/mariage/partage"]);
    });

    it("names the search couples type, under sixty characters with the brand", () => {
        expect(metadata.title).toMatch(/^Site de mariage sur-mesure/);
        expect(`${metadata.title} | AlexDevLab`.length).toBeLessThanOrEqual(60);
    });
});
