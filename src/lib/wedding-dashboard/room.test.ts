import { describe, expect, it } from "vitest";

import { freeSpot, roomDimensions, TABLE_RADIUS } from "./room";
import type { RoomLayout, SeatTable } from "./types";

const room: RoomLayout = {
    name: "L'orangerie",
    size: "s",
    head: { x: 50, y: 11 },
    entrance: { x: 50, y: 96 },
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
