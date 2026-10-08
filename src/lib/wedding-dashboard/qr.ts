import { encode } from "uqr";

/** A link as a QR code: its side in modules, and its dark modules as a single SVG path. */
export type QrCode = { readonly size: number; readonly path: string };

/** The dark stretches of a row: where each starts and how many modules it covers. */
const runs = (row: readonly boolean[]) =>
    row.reduce<readonly { readonly x: number; readonly length: number }[]>((found, on, x) => {
        if (!on) return found;
        const last = found.at(-1);
        return last && last.x + last.length === x
            ? [...found.slice(0, -1), { x: last.x, length: last.length + 1 }]
            : [...found, { x, length: 1 }];
    }, []);

/**
 * The QR code of a link, medium error correction so a fold or a stain on paper still scans.
 * The path is in modules, one unit each: scale it to any size, on screen or in a PDF. Four
 * modules of quiet zone by default, as print asks; fewer on screen, where the card is the margin.
 */
export const qrCode = (text: string, { border = 4 }: { border?: number } = {}): QrCode => {
    const { size, data } = encode(text, { ecc: "M", border });
    const path = data
        .flatMap((row, y) => runs(row).map(({ x, length }) => `M${x} ${y}h${length}v1h-${length}z`))
        .join("");
    return { size, path };
};
