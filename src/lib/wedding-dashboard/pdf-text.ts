import type { PDFFont } from "pdf-lib";

/**
 * The standard fonts only draw Western European letters: "Łucja" becomes "Lucja", and what
 * cannot be brought back to a Latin letter, an emoji, is left out.
 */
export const drawable = (font: PDFFont) => {
    const known = new Set(font.getCharacterSet());
    const keep = (char: string) => known.has(char.codePointAt(0) ?? 0);
    return (text: string) =>
        [...text]
            .map((char) => {
                if (keep(char)) return char;
                const plain = char.normalize("NFD").replace(/\p{Diacritic}/gu, "");
                return [...plain].every(keep)
                    ? plain
                    : char === "Ł"
                      ? "L"
                      : char === "ł"
                        ? "l"
                        : "";
            })
            .join("")
            .replace(/\s+/g, " ")
            .trim();
};

/** Words laid out on lines no wider than `width`. */
export const wrap = (text: string, font: PDFFont, size: number, width: number) =>
    text.split(" ").reduce<readonly string[]>((lines, word) => {
        const last = lines.at(-1);
        if (last === undefined) return [word];
        const joined = `${last} ${word}`;
        return font.widthOfTextAtSize(joined, size) <= width
            ? [...lines.slice(0, -1), joined]
            : [...lines, word];
    }, []);
