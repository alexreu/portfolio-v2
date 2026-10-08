import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";

import { invitationPdf, posterPdf } from "./print-pdf";
import type { InvitationCard, InvitationPrint, QrPoster } from "./prints";

const A5 = { width: 419.53, height: 595.28 };
const A4 = { width: 595.28, height: 841.89 };

const card: InvitationCard = {
    addressee: null,
    couple: "Camille & Hugo",
    when: "Samedi 12 juin 2027 · Luberon",
    answerBy: "Merci de répondre avant le 1er mai 2027",
    qrUrl: "https://alexdevlab.fr/mariage/demo",
    qrNote: "Scannez pour répondre",
    siteLabel: "alexdevlab.fr/mariage/demo",
};

const print: InvitationPrint = {
    title: "Faire-part de Camille & Hugo",
    tone: "olive",
    cards: [card],
    filename: "faire-part-camille-hugo.pdf",
};

const poster: QrPoster = {
    title: "Galerie photo · Camille & Hugo",
    couple: "Camille & Hugo",
    when: "Samedi 12 juin 2027 · Luberon",
    welcome: "Merci d'être là",
    headline: "Partagez vos photos",
    detail: "Scannez le code et donnez votre nom : vos photos arrivent dans notre galerie.",
    qrUrl: "https://alexdevlab.fr/mariage/demo/galerie",
    addressLabel: "alexdevlab.fr/mariage/demo/galerie",
    tableCards: true,
    tone: "terre",
    filename: "affiche-galerie-camille-hugo.pdf",
};

const sizeOf = (pdf: PDFDocument, index: number) => {
    const { width, height } = pdf.getPage(index).getSize();
    return { width: Math.round(width), height: Math.round(height) };
};

const rounded = ({ width, height }: { width: number; height: number }) => ({
    width: Math.round(width),
    height: Math.round(height),
});

describe("invitationPdf", () => {
    it("prints the shared faire-part on one A5 page, titled after the couple", async () => {
        const pdf = await PDFDocument.load(await invitationPdf(print));

        expect(pdf.getPageCount()).toBe(1);
        expect(sizeOf(pdf, 0)).toEqual(rounded(A5));
        expect(pdf.getTitle()).toBe("Faire-part de Camille & Hugo");
    });

    it("prints one page per household", async () => {
        const cards = ["Famille Martin", "Zoé & Élodie", "Łucja 🌿"].map((addressee) => ({
            ...card,
            addressee,
            qrUrl: `${card.qrUrl}?foyer=${addressee}`,
        }));
        const pdf = await PDFDocument.load(await invitationPdf({ ...print, cards }));

        expect(pdf.getPageCount()).toBe(3);
    });
});

describe("posterPdf", () => {
    it("prints the A4 poster, then a page of four table cards to cut out", async () => {
        const pdf = await PDFDocument.load(await posterPdf(poster));

        expect(pdf.getPageCount()).toBe(2);
        expect(sizeOf(pdf, 0)).toEqual(rounded(A4));
        expect(sizeOf(pdf, 1)).toEqual(rounded(A4));
        expect(pdf.getTitle()).toBe("Galerie photo · Camille & Hugo");
    });

    it("prints the poster alone when the page is not for the tables", async () => {
        const pdf = await PDFDocument.load(await posterPdf({ ...poster, tableCards: false }));

        expect(pdf.getPageCount()).toBe(1);
    });
});
