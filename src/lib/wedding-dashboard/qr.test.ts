import { encode } from "uqr";
import { describe, expect, it } from "vitest";

import { qrCode } from "./qr";

const URL = "https://alexdevlab.fr/mariage/demo?foyer=famille-martin-demo";

/** Every dark module the path draws, read back from its "M x y h n" runs. */
const drawn = (path: string) =>
    [...path.matchAll(/M(\d+) (\d+)h(\d+)/g)].flatMap(([, x, y, length]) =>
        [...Array(Number(length)).keys()].map((step) => `${Number(x) + step},${y}`),
    );

describe("qrCode", () => {
    it("draws exactly the dark modules of the code, quiet zone included", () => {
        const { size, data } = encode(URL, { ecc: "M", border: 4 });
        const dark = data.flatMap((row, y) => row.flatMap((on, x) => (on ? [`${x},${y}`] : [])));

        const qr = qrCode(URL);

        expect(qr.size).toBe(size);
        expect(drawn(qr.path).sort()).toEqual(dark.sort());
    });

    it("joins neighbouring modules of a row into one run", () => {
        /** The top-left finder starts with seven dark modules after the four of quiet zone. */
        expect(qrCode(URL).path.startsWith("M4 4h7v1h-7z")).toBe(true);
    });

    it("leaves a narrower quiet zone when asked, for a code shown on screen", () => {
        const wide = qrCode(URL);
        const narrow = qrCode(URL, { border: 1 });

        expect(narrow.size).toBe(wide.size - 6);
        expect(narrow.path.startsWith("M1 1h7")).toBe(true);
    });
});
