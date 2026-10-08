import type { RoomFixture, RoomLayout, RoomPoint, RoomSize, SeatTable } from "./types";

/** A round table on the plan, in room units. */
export const TABLE_RADIUS = 15;

/** Half the couple's long table and half the entrance label, in room units. */
export const HEAD_HALF = { width: 45, height: 9 } as const;
export const ENTRANCE_HALF = { width: 60, height: 8 } as const;

const dimensions: Record<RoomSize, { readonly width: number; readonly height: number }> = {
    s: { width: 280, height: 150 },
    m: { width: 400, height: 230 },
    l: { width: 560, height: 330 },
    xl: { width: 720, height: 440 },
};

/** A fixture's half size once turned: a side wall swaps its width and its height. */
export const turned = (half: { width: number; height: number }, fixture: RoomFixture) =>
    fixture.rotation === 90 ? { width: half.height, height: half.width } : half;

/** Space kept between a wall and the couple's table or the entrance, in room units. */
export const WALL_GAP = 5;

const within = (value: number, low: number) => Math.min(Math.max(value, low), 100 - low);

/**
 * Where a fixture may stand: whole inside the room, a little away from every wall, turned or
 * not. In percent of the room, as stored.
 */
export const fixtureInside = (
    room: Pick<RoomLayout, "size">,
    fixture: RoomFixture,
    half: { width: number; height: number },
): RoomFixture => {
    const { width, height } = roomDimensions(room.size);
    const extent = turned(half, fixture);
    const bound = (span: number, size: number) => ((span + WALL_GAP) / size) * 100;
    return {
        ...fixture,
        x: within(fixture.x, bound(extent.width, width)),
        y: within(fixture.y, bound(extent.height, height)),
    };
};

/** The bigger the room, the smaller the tables on screen: about 10, 20, 40 and 60 tables. */
export const roomDimensions = (size: RoomSize) => dimensions[size];

const MARGIN = 6;
const STEP = TABLE_RADIUS * 2 + 10;

const toUnits = (point: RoomPoint, size: RoomSize) => {
    const { width, height } = roomDimensions(size);
    return { x: (point.x / 100) * width, y: (point.y / 100) * height };
};

/** Distance from a point to a box centred on `centre`, zero inside it. */
const clearance = (
    point: { x: number; y: number },
    centre: { x: number; y: number },
    half: { width: number; height: number },
) =>
    Math.hypot(
        Math.max(Math.abs(point.x - centre.x) - half.width, 0),
        Math.max(Math.abs(point.y - centre.y) - half.height, 0),
    );

/**
 * Where a new table goes: the first place, row by row, that touches neither another table,
 * the couple's table nor the entrance. The room's centre if it is full.
 */
export const freeSpot = (tables: readonly SeatTable[], room: RoomLayout): RoomPoint => {
    const { width, height } = roomDimensions(room.size);
    const head = toUnits(room.head, room.size);
    const entrance = toUnits(room.entrance, room.size);
    const others = tables.map((table) => toUnits(table, room.size));
    const first = TABLE_RADIUS + MARGIN;
    const rows = [...Array(Math.floor((height - 2 * first) / STEP) + 1).keys()].map(
        (row) => first + row * STEP,
    );
    const columns = [...Array(Math.floor((width - 2 * first) / STEP) + 1).keys()].map(
        (column) => first + column * STEP,
    );
    const spot = rows
        .flatMap((y) => columns.map((x) => ({ x, y })))
        .find(
            (point) =>
                clearance(point, head, turned(HEAD_HALF, room.head)) > TABLE_RADIUS + MARGIN &&
                clearance(point, entrance, turned(ENTRANCE_HALF, room.entrance)) >
                    TABLE_RADIUS + MARGIN &&
                others.every(
                    (other) =>
                        Math.hypot(point.x - other.x, point.y - other.y) >
                        TABLE_RADIUS * 2 + MARGIN,
                ),
        );
    if (!spot) return { x: 50, y: 50 };
    return {
        x: Math.round((spot.x / width) * 1000) / 10,
        y: Math.round((spot.y / height) * 1000) / 10,
    };
};
