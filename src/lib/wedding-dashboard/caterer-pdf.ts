import { PDFDocument, rgb, StandardFonts, type PDFPage } from "pdf-lib";

import type { CatererSheet } from "./caterer-sheet";
import { drawable, wrap } from "./pdf-text";

/** A4 in points, with the dashboard's ink, muted brown and gold. */
const PAGE = { width: 595.28, height: 841.89 } as const;
const MARGIN = 56;
const FOOTER = 36;
const RIGHT = PAGE.width - MARGIN;
const WIDTH = RIGHT - MARGIN;

const ink = rgb(0x1e / 255, 0x1b / 255, 0x17 / 255);
const soft = rgb(0x3a / 255, 0x34 / 255, 0x2d / 255);
const muted = rgb(0x6b / 255, 0x63 / 255, 0x59 / 255);
const line = rgb(0xdd / 255, 0xd5 / 255, 0xc8 / 255);
const gold = rgb(0x7a / 255, 0x5f / 255, 0x37 / 255);

/** Under a table without special menus: all standard, or nobody confirmed yet. */
const tableDetail = (table: CatererSheet["tables"][number]) => {
    if (table.count === 0) return "personne de confirmé pour l'instant";
    return table.notes.length > 0 ? "" : "menu standard";
};

/**
 * The caterer's sheet as an A4 PDF: who, when, the covers and menus, then table by table.
 * Drawn with the standard Helvetica, so nothing is downloaded but this module.
 */
export const catererPdf = async (sheet: CatererSheet): Promise<Uint8Array> => {
    const pdf = await PDFDocument.create();
    pdf.setTitle(`${sheet.title} · ${sheet.wedding}`);
    pdf.setCreator("AlexDevLab");
    pdf.setLanguage("fr-FR");
    const regular = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const clean = drawable(regular);

    /** The page being drawn and how far down it is; a new page starts when one is full. */
    let page: PDFPage = pdf.addPage([PAGE.width, PAGE.height]);
    let y = PAGE.height - MARGIN;

    const room = (height: number) => {
        if (y - height >= MARGIN + FOOTER) return;
        page = pdf.addPage([PAGE.width, PAGE.height]);
        y = PAGE.height - MARGIN;
    };

    const text = (
        value: string,
        { size = 11, font = regular, color = ink, x = MARGIN, gap = 4, width = WIDTH } = {},
    ) => {
        wrap(clean(value), font, size, width - (x - MARGIN)).forEach((row) => {
            room(size + gap);
            y -= size;
            page.drawText(row, { x, y, size, font, color });
            y -= gap;
        });
    };

    const rule = (color = line, space = 10) => {
        room(space * 2);
        y -= space;
        page.drawLine({
            start: { x: MARGIN, y },
            end: { x: RIGHT, y },
            thickness: 0.6,
            color,
        });
        y -= space;
    };

    /** A label on the left, its figure set flush right on the same line. */
    const row = (label: string, figure: string, detail: string) => {
        room(detail ? 32 : 20);
        const top = y;
        text(label, { size: 11, font: bold, width: WIDTH - 80 });
        if (detail) text(detail, { size: 9, color: muted, width: WIDTH - 80 });
        const figureText = clean(figure);
        page.drawText(figureText, {
            x: RIGHT - bold.widthOfTextAtSize(figureText, 11),
            y: top - 11,
            size: 11,
            font: bold,
            color: ink,
        });
    };

    const heading = (title: string) => {
        room(48);
        y -= 18;
        text(title.toUpperCase(), { size: 8.5, font: bold, color: gold, gap: 6 });
    };

    text(sheet.title.toUpperCase(), { size: 8.5, font: bold, color: gold, gap: 10 });
    text(sheet.wedding, { size: 22, font: bold, gap: 8 });
    text(sheet.when, { size: 11, color: soft });
    text(sheet.edited, { size: 9, color: muted, gap: 0 });
    rule(ink, 14);

    text(`${sheet.total} couverts`, { size: 18, font: bold, gap: 6 });
    if (sheet.warning) text(sheet.warning, { size: 9.5, color: gold });

    heading("Menus");
    sheet.menus.forEach((menu, index) => {
        if (index > 0) rule(line, 6);
        row(menu.label, String(menu.count), menu.detail);
    });

    if (sheet.tables.length > 0) {
        heading("Par table");
        sheet.tables.forEach((table, index) => {
            if (index > 0) rule(line, 6);
            row(
                table.label,
                `${table.count} ${table.count > 1 ? "couverts" : "couvert"}`,
                tableDetail(table),
            );
            table.notes.forEach((note) => text(note, { size: 9.5, color: soft, x: MARGIN + 12 }));
        });
        if (sheet.unseated) {
            y -= 6;
            text(sheet.unseated, { size: 9.5, color: gold });
        }
    }

    const pages = pdf.getPages();
    pages.forEach((each, index) => {
        each.drawText(clean(`${sheet.wedding} · ${sheet.edited}`), {
            x: MARGIN,
            y: MARGIN - 20,
            size: 8,
            font: regular,
            color: muted,
        });
        const number = `${index + 1} / ${pages.length}`;
        each.drawText(number, {
            x: RIGHT - regular.widthOfTextAtSize(number, 8),
            y: MARGIN - 20,
            size: 8,
            font: regular,
            color: muted,
        });
    });

    return pdf.save();
};
