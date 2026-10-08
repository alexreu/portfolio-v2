import { describe, expect, it } from "vitest";

import {
    ENTRANCE_HALF,
    fixtureInside,
    freeSpot,
    HEAD_HALF,
    roomDimensions,
    TABLE_RADIUS,
    tablesRevealAt,
    tablesRevealed,
    WALL_GAP,
} from "./room";
import type { RoomLayout, SeatTable } from "./types";

const room: RoomLayout = {
    name: "L'orangerie",
    size: "s",
    revealAt: "10:00",
    head: { x: 50, y: 11, rotation: 0 },
    entrance: { x: 50, y: 96, rotation: 0 },
};

const table = (id: string, x: number, y: number): SeatTable => ({
    id,
    number: Number(id),
    name: id,
    capacity: 8,
    x,
    y,
});

const distance = (a: { x: number; y: number }, b: { x: number; y: number }, size = room.size) => {
    const { width, height } = roomDimensions(size);
    return Math.hypot(((a.x - b.x) / 100) * width, ((a.y - b.y) / 100) * height);
};

describe("roomDimensions", () => {
    it("grows the room so that more tables fit", () => {
        expect(roomDimensions("s")).toEqual({ width: 280, height: 150 });
        expect(roomDimensions("xl").width).toBeGreaterThan(roomDimensions("l").width);
    });
});

describe("freeSpot", () => {
    it("puts the first table in the room, away from the couple's table", () => {
        const spot = freeSpot([], room);

        expect(distance(spot, room.head)).toBeGreaterThan(TABLE_RADIUS * 2);
    });

    it("keeps clear of a couple's table turned along a side wall", () => {
        const side = { ...room, head: { x: 8, y: 50, rotation: 90 as const } };
        const { width, height } = roomDimensions(side.size);
        const spot = freeSpot([], side);
        const dx = Math.abs(((spot.x - side.head.x) / 100) * width);
        const dy = Math.abs(((spot.y - side.head.y) / 100) * height);

        expect(dx > HEAD_HALF.height + TABLE_RADIUS || dy > HEAD_HALF.width + TABLE_RADIUS).toBe(
            true,
        );
    });

    it("never puts a new table on top of another one", () => {
        const tables = [table("1", 16, 39), table("2", 36, 39), table("3", 64, 39)];
        const spot = freeSpot(tables, room);

        tables.forEach((other) => expect(distance(spot, other)).toBeGreaterThan(TABLE_RADIUS * 2));
    });

    it("finds room for a thirtieth table in a large room", () => {
        const large = { ...room, size: "l" as const };
        const tables = [...Array(29).keys()].reduce<readonly SeatTable[]>(
            (placed, n) => [
                ...placed,
                { ...table(String(n + 1), 0, 0), ...freeSpot(placed, large) },
            ],
            [],
        );
        const spot = freeSpot(tables, large);

        tables.forEach((other) =>
            expect(distance(spot, other, "l")).toBeGreaterThan(TABLE_RADIUS * 2),
        );
    });
});

describe("fixtureInside", () => {
    const sizes = ["s", "m", "l", "xl"] as const;
    const corners = [
        { x: 0, y: 0 },
        { x: 100, y: 100 },
        { x: 50, y: 96 },
        { x: 1, y: 50 },
    ];

    it("keeps the entrance and the couple's table whole, clear of every wall", () => {
        sizes.forEach((size) => {
            const { width, height } = roomDimensions(size);
            [ENTRANCE_HALF, HEAD_HALF].forEach((half) =>
                ([0, 90] as const).forEach((rotation) =>
                    corners.forEach((corner) => {
                        const fixture = fixtureInside({ size }, { ...corner, rotation }, half);
                        const extent =
                            rotation === 90 ? { width: half.height, height: half.width } : half;
                        const x = (fixture.x / 100) * width;
                        const y = (fixture.y / 100) * height;

                        expect(x - extent.width).toBeGreaterThanOrEqual(WALL_GAP - 0.01);
                        expect(x + extent.width).toBeLessThanOrEqual(width - WALL_GAP + 0.01);
                        expect(y - extent.height).toBeGreaterThanOrEqual(WALL_GAP - 0.01);
                        expect(y + extent.height).toBeLessThanOrEqual(height - WALL_GAP + 0.01);
                    }),
                ),
            );
        });
    });

    it("leaves a fixture already clear of the walls where it is", () => {
        expect(fixtureInside(room, room.head, HEAD_HALF)).toEqual(room.head);
    });
});

describe("tablesRevealed", () => {
    it("shows the tables on the wedding day from the hour the couple chose, Paris time", () => {
        expect(tablesRevealAt("2027-06-12", "10:00")).toBe("2027-06-12T10:00:00+02:00");
        expect(tablesRevealed("2027-06-12", "10:00", new Date("2027-06-12T09:59:00+02:00"))).toBe(
            false,
        );
        expect(tablesRevealed("2027-06-12", "10:00", new Date("2027-06-12T10:00:00+02:00"))).toBe(
            true,
        );
    });

    it("counts the winter hour too", () => {
        expect(tablesRevealAt("2027-12-18", "09:30")).toBe("2027-12-18T09:30:00+01:00");
    });
});
