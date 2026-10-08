import { describe, expect, it } from "vitest";

import { followPointer, startDrag } from "./plan-drag";

const press = startDrag(
    "t3",
    { x: 50, y: 50 },
    { room: { x: 45, y: 50 }, screen: { x: 300, y: 200 } },
    false,
);

describe("followPointer", () => {
    it("keeps a press that trembles a few pixels a click", () => {
        const next = followPointer(
            press,
            { room: { x: 45.5, y: 50.4 }, screen: { x: 303, y: 202 } },
            6,
        );

        expect(next).toMatchObject({ moved: false, at: { x: 50, y: 50 } });
    });

    it("keeps the point grabbed under the pointer, instead of jumping to its centre", () => {
        const next = followPointer(
            press,
            { room: { x: 55, y: 52 }, screen: { x: 340, y: 208 } },
            6,
        );

        expect(next).toMatchObject({ moved: true, at: { x: 60, y: 52 } });
    });

    it("stays a drag once started, even when the pointer comes back near its start", () => {
        const away = followPointer(
            press,
            { room: { x: 55, y: 50 }, screen: { x: 340, y: 200 } },
            6,
        );
        const back = followPointer(
            away,
            { room: { x: 45.2, y: 50 }, screen: { x: 301, y: 200 } },
            6,
        );

        expect(back.moved).toBe(true);
        expect(back.at.x).toBeCloseTo(50.2);
    });
});
