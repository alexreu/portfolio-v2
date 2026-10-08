import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";

import { catererPdf } from "./caterer-pdf";
import type { CatererSheet } from "./caterer-sheet";

const sheet: CatererSheet = {
    title: "Récapitulatif traiteur · Dîner & soirée",
    wedding: "Mariage de Camille & Hugo",
    when: "Samedi 12 juin 2027 · Luberon",
    edited: "Édité le 7 octobre 2026",
    total: 22,
    warning: "8 invités n'ont pas encore répondu pour ce repas : chiffres provisoires.",
    menus: [
        { label: "Menu standard", detail: "adultes", count: 10 },
        { label: "Autre", detail: "allergie aux arachides", count: 1 },
    ],
    tables: [{ label: "Table 1 · Les Lavandes", count: 7, notes: ["Végétarien : Claire, Œdipe"] }],
    unseated: "4 invités confirmés n'ont pas encore de table.",
    filename: "recap-traiteur-camille-hugo-diner.pdf",
};

const read = async (bytes: Uint8Array) => PDFDocument.load(bytes);

describe("catererPdf", () => {
    it("makes a one-page PDF titled after the wedding", async () => {
        const bytes = await catererPdf(sheet);
        const pdf = await read(bytes);

        expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
        expect(pdf.getPageCount()).toBe(1);
        expect(pdf.getTitle()).toBe(
            "Récapitulatif traiteur · Dîner & soirée · Mariage de Camille & Hugo",
        );
    });

    it("goes on to more pages when sixty tables do not fit on one", async () => {
        const tables = [...Array(60).keys()].map((index) => ({
            label: `Table ${index + 1} · Table ${index + 1}`,
            count: 8,
            notes: ["Végétarien : Claire, Paul", "Menu enfant : Léo, Lina, Tom"],
        }));
        const pdf = await read(await catererPdf({ ...sheet, tables }));

        expect(pdf.getPageCount()).toBeGreaterThan(1);
    });

    it("writes names the standard font cannot draw instead of failing", async () => {
        const bytes = await catererPdf({
            ...sheet,
            tables: [{ label: "Table 1 · Łąka 🌿", count: 1, notes: ["Végan : Zoë, Łucja, 李"] }],
        });

        expect((await read(bytes)).getPageCount()).toBe(1);
    });
});
