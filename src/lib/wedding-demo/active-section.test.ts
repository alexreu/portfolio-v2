import { describe, expect, it } from "vitest";

import { activeSection } from "./active-section";

const boxes = [
    { id: "programme", top: -900, bottom: -100 },
    { id: "lieux", top: -100, bottom: 600 },
    { id: "faq", top: 1400, bottom: 2000 },
];

describe("activeSection", () => {
    it("is the section under the reading line", () => {
        expect(activeSection(boxes, { line: 300, viewport: 800, atEnd: false })).toBe("lieux");
    });

    it("is none between two sections the menu does not lead to", () => {
        expect(
            activeSection(
                [
                    { id: "programme", top: -900, bottom: 100 },
                    { id: "lieux", top: 700, bottom: 1400 },
                ],
                { line: 300, viewport: 800, atEnd: false },
            ),
        ).toBeNull();
    });

    it("at the end of the page, is the last section in sight, too short to reach the line", () => {
        const end = [
            { id: "lieux", top: -800, bottom: 200 },
            { id: "faq", top: 400, bottom: 700 },
        ];

        expect(activeSection(end, { line: 300, viewport: 800, atEnd: true })).toBe("faq");
        expect(activeSection(end, { line: 300, viewport: 800, atEnd: false })).toBeNull();
    });
});
