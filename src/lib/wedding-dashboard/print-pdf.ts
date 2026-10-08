import {
    PDFDocument,
    rgb,
    setCharacterSpacing,
    StandardFonts,
    type Color,
    type PDFFont,
    type PDFPage,
} from "pdf-lib";

import { drawable, wrap } from "./pdf-text";
import type { InvitationCard, InvitationPrint, QrPoster } from "./prints";
import { qrCode } from "./qr";
import type { SealTone } from "./types";

/** Paper sizes in points. */
const A5 = { width: 419.53, height: 595.28 } as const;
const A4 = { width: 595.28, height: 841.89 } as const;

const hex = (value: number) =>
    rgb(((value >> 16) & 0xff) / 255, ((value >> 8) & 0xff) / 255, (value & 0xff) / 255);

/** The site's ink and paper, and the seal's colour for rules and the ampersand. */
const ink = hex(0x1f1d1a);
const soft = hex(0x47423a);
const muted = hex(0x6b6359);
const cut = hex(0xbdb5a8);
const tones: Record<SealTone, Color> = {
    olive: hex(0x5e6b4e),
    terre: hex(0x7a5a3f),
    encre: hex(0x1f1d1a),
};

type Fonts = { readonly roman: PDFFont; readonly italic: PDFFont; readonly sans: PDFFont };

/** A rectangle of the page, from its bottom-left corner, as PDF counts. */
type Frame = {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
};

type TextStyle = {
    readonly font: PDFFont;
    readonly size: number;
    readonly color: Color;
    /** Extra room between letters, for small capitals. */
    readonly spacing?: number;
};

const document = async (title: string) => {
    const pdf = await PDFDocument.create();
    pdf.setTitle(title);
    pdf.setCreator("AlexDevLab");
    pdf.setLanguage("fr-FR");
    const fonts: Fonts = {
        roman: await pdf.embedFont(StandardFonts.TimesRoman),
        italic: await pdf.embedFont(StandardFonts.TimesRomanItalic),
        sans: await pdf.embedFont(StandardFonts.Helvetica),
    };
    return { pdf, fonts };
};

const widthOf = (text: string, { font, size, spacing = 0 }: TextStyle) =>
    font.widthOfTextAtSize(text, size) + spacing * Math.max(0, text.length - 1);

/** The largest size up to `size` at which the text holds on one line of `width`. */
const fitted = (text: string, style: TextStyle, width: number): TextStyle => {
    const natural = widthOf(drawable(style.font)(text), style);
    return natural <= width ? style : { ...style, size: (style.size * width) / natural };
};

/** One line centred on `cx`, its baseline at `y`; letters the font lacks are brought back. */
const centered = (page: PDFPage, value: string, style: TextStyle, cx: number, y: number) => {
    const text = drawable(style.font)(value);
    const x = cx - widthOf(text, style) / 2;
    if (style.spacing) page.pushOperators(setCharacterSpacing(style.spacing));
    page.drawText(text, { x, y, size: style.size, font: style.font, color: style.color });
    if (style.spacing) page.pushOperators(setCharacterSpacing(0));
};

/** Lines no wider than `width`, centred; returns the baseline below the last one. */
const paragraph = (
    page: PDFPage,
    value: string,
    style: TextStyle,
    cx: number,
    y: number,
    width: number,
) =>
    wrap(drawable(style.font)(value), style.font, style.size, width).reduce((baseline, line) => {
        centered(page, line, style, cx, baseline);
        return baseline - style.size * 1.35;
    }, y);

/** The QR code as a square of `side` points, its top edge at `top`. */
const qr = (page: PDFPage, url: string, cx: number, top: number, side: number) => {
    const code = qrCode(url);
    page.drawSvgPath(code.path, {
        x: cx - side / 2,
        y: top,
        scale: side / code.size,
        color: ink,
        borderWidth: 0,
    });
};

/** A double rule around the card, the outer one in the seal's colour. */
const border = (page: PDFPage, frame: Frame, inset: number, tone: Color) => {
    const rule = (gap: number, thickness: number, color: Color) =>
        page.drawRectangle({
            x: frame.x + gap,
            y: frame.y + gap,
            width: frame.width - gap * 2,
            height: frame.height - gap * 2,
            borderColor: color,
            borderWidth: thickness,
        });
    rule(inset, 0.9, tone);
    rule(inset + 4.5, 0.35, tone);
};

/** "Camille & Hugo" on one line, the ampersand in italic and in the seal's colour. */
const couple = (
    page: PDFPage,
    fonts: Fonts,
    names: string,
    tone: Color,
    cx: number,
    y: number,
    size: number,
    width: number,
) => {
    const [first, second = ""] = names.split(" & ");
    const roman = drawable(fonts.roman);
    const parts = [
        { text: `${roman(first)} `, font: fonts.roman, color: ink },
        { text: "&", font: fonts.italic, color: tone },
        { text: ` ${roman(second)}`, font: fonts.roman, color: ink },
    ];
    const natural = parts.reduce(
        (sum, part) => sum + part.font.widthOfTextAtSize(part.text, size),
        0,
    );
    const scaled = natural > width ? (size * width) / natural : size;
    parts.reduce(
        (x, part) => {
            page.drawText(part.text, { x, y, size: scaled, font: part.font, color: part.color });
            return x + part.font.widthOfTextAtSize(part.text, scaled);
        },
        cx - Math.min(natural, width) / 2,
    );
};

/** A5 faire-part: who it is for, the couple, the day, then the QR code to answer. */
const invitationPage = (page: PDFPage, fonts: Fonts, card: InvitationCard, tone: Color) => {
    const { width, height } = A5;
    const cx = width / 2;
    const room = width - 96;
    border(page, { x: 0, y: 0, width, height }, 22, tone);

    const greeting = card.addressee ? `Pour ${card.addressee}` : "Vous êtes invités";
    const greetingStyle = { font: fonts.italic, size: 13, color: soft };
    centered(page, greeting, fitted(greeting, greetingStyle, room), cx, height - 76);

    const [first, second = ""] = card.couple.split(" & ");
    const nameStyle = { font: fonts.roman, size: 42, color: ink };
    centered(page, first, fitted(first, nameStyle, room), cx, height - 150);
    centered(page, "&", { font: fonts.italic, size: 28, color: tone }, cx, height - 186);
    centered(page, second, fitted(second, nameStyle, room), cx, height - 230);

    centered(
        page,
        "ont la joie de vous inviter à leur mariage",
        { font: fonts.italic, size: 13.5, color: soft },
        cx,
        height - 268,
    );
    page.drawLine({
        start: { x: cx - 22, y: height - 288 },
        end: { x: cx + 22, y: height - 288 },
        thickness: 0.7,
        color: tone,
    });
    const when = card.when.toUpperCase();
    const whenStyle = { font: fonts.sans, size: 8.5, color: ink, spacing: 1.4 };
    centered(page, when, fitted(when, whenStyle, room), cx, height - 310);

    const side = 104;
    const top = 236;
    centered(page, card.qrNote, { font: fonts.sans, size: 8, color: muted }, cx, top + 12);
    qr(page, card.qrUrl, cx, top, side);
    centered(
        page,
        `ou sur ${card.siteLabel}`,
        { font: fonts.sans, size: 7.5, color: muted },
        cx,
        top - side - 14,
    );
    centered(page, card.answerBy, { font: fonts.italic, size: 11, color: soft }, cx, 64);
};

/** The faire-part as a PDF to print at home or at a printer's, one card per A5 page. */
export const invitationPdf = async (print: InvitationPrint): Promise<Uint8Array> => {
    const { pdf, fonts } = await document(print.title);
    print.cards.forEach((card) =>
        invitationPage(pdf.addPage([A5.width, A5.height]), fonts, card, tones[print.tone]),
    );
    return pdf.save();
};

/** The A4 poster at the entrance: welcome, the couple, one big code and what it opens. */
const posterPage = (page: PDFPage, fonts: Fonts, poster: QrPoster, tone: Color) => {
    const { width, height } = A4;
    const cx = width / 2;
    const room = width - 140;
    border(page, { x: 0, y: 0, width, height }, 28, tone);

    const welcomeStyle = { font: fonts.italic, size: 21, color: soft };
    centered(page, poster.welcome, fitted(poster.welcome, welcomeStyle, room), cx, height - 112);
    couple(page, fonts, poster.couple, tone, cx, height - 178, 50, room);
    const when = poster.when.toUpperCase();
    const whenStyle = { font: fonts.sans, size: 9.5, color: ink, spacing: 1.6 };
    centered(page, when, fitted(when, whenStyle, room), cx, height - 212);

    const side = 236;
    const top = height - 250;
    qr(page, poster.qrUrl, cx, top, side);
    centered(
        page,
        "Ouvrez l'appareil photo de votre téléphone et visez le code",
        { font: fonts.sans, size: 9, color: muted },
        cx,
        top - side - 16,
    );

    centered(
        page,
        poster.headline,
        { font: fonts.roman, size: 28, color: ink },
        cx,
        top - side - 66,
    );
    paragraph(
        page,
        poster.detail,
        { font: fonts.sans, size: 11, color: soft },
        cx,
        top - side - 92,
        330,
    );

    centered(
        page,
        `ou sur ${poster.addressLabel}`,
        { font: fonts.sans, size: 8.5, color: muted },
        cx,
        70,
    );
};

/** A6 card for a table: the same code, smaller, with what it opens. */
const tableCard = (page: PDFPage, fonts: Fonts, poster: QrPoster, tone: Color, frame: Frame) => {
    const cx = frame.x + frame.width / 2;
    const topOf = frame.y + frame.height;
    const room = frame.width - 60;
    border(page, frame, 16, tone);
    couple(page, fonts, poster.couple, tone, cx, topOf - 66, 24, room);
    const when = poster.when.toUpperCase();
    const whenStyle = { font: fonts.sans, size: 6.5, color: ink, spacing: 1 };
    centered(page, when, fitted(when, whenStyle, room), cx, topOf - 86);
    const side = 172;
    const top = topOf - 112;
    qr(page, poster.qrUrl, cx, top, side);
    centered(
        page,
        poster.headline,
        fitted(poster.headline, { font: fonts.italic, size: 16, color: ink }, room),
        cx,
        top - side - 24,
    );
    centered(
        page,
        "Scannez avec votre téléphone",
        { font: fonts.sans, size: 7.5, color: muted },
        cx,
        top - side - 40,
    );
    centered(
        page,
        `ou sur ${poster.addressLabel}`,
        { font: fonts.sans, size: 6.5, color: muted },
        cx,
        frame.y + 34,
    );
};

/** Dashed lines where the A4 sheet is cut into four table cards. */
const cutLines = (page: PDFPage) => {
    const dashed = { thickness: 0.4, color: cut, dashArray: [3, 3] };
    page.drawLine({
        start: { x: A4.width / 2, y: 0 },
        end: { x: A4.width / 2, y: A4.height },
        ...dashed,
    });
    page.drawLine({
        start: { x: 0, y: A4.height / 2 },
        end: { x: A4.width, y: A4.height / 2 },
        ...dashed,
    });
};

/**
 * A QR code to print for the day: an A4 poster for the entrance, then, when the page is for
 * every table, an A4 sheet cut into four cards.
 */
export const posterPdf = async (poster: QrPoster): Promise<Uint8Array> => {
    const { pdf, fonts } = await document(poster.title);
    const tone = tones[poster.tone];
    posterPage(pdf.addPage([A4.width, A4.height]), fonts, poster, tone);
    if (!poster.tableCards) return pdf.save();
    const sheet = pdf.addPage([A4.width, A4.height]);
    const half = { width: A4.width / 2, height: A4.height / 2 };
    [
        { x: 0, y: half.height },
        { x: half.width, y: half.height },
        { x: 0, y: 0 },
        { x: half.width, y: 0 },
    ].forEach((corner) => tableCard(sheet, fonts, poster, tone, { ...corner, ...half }));
    cutLines(sheet);
    return pdf.save();
};
