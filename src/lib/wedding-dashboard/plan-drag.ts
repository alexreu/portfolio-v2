import type { RoomPoint } from "./types";

/** Where the pointer is: in the room, in percent, and on screen, in pixels. */
export type PlanPointer = { readonly room: RoomPoint; readonly screen: RoomPoint };

/** An item pressed on the room plan, and where it goes while the pointer moves. */
export type PlanDrag = {
    readonly item: string;
    readonly additive: boolean;
    readonly origin: RoomPoint;
    readonly grab: PlanPointer;
    readonly at: RoomPoint;
    readonly moved: boolean;
};

export const startDrag = (
    item: string,
    origin: RoomPoint,
    grab: PlanPointer,
    additive: boolean,
): PlanDrag => ({ item, additive, origin, grab, at: origin, moved: false });

/**
 * The press stays a click until the pointer has travelled `threshold` pixels on screen; then the
 * item follows it, keeping the point grabbed under the pointer.
 */
export const followPointer = (
    drag: PlanDrag,
    pointer: PlanPointer,
    threshold: number,
): PlanDrag => {
    const travelled = Math.hypot(
        pointer.screen.x - drag.grab.screen.x,
        pointer.screen.y - drag.grab.screen.y,
    );
    if (!drag.moved && travelled < threshold) return drag;
    return {
        ...drag,
        moved: true,
        at: {
            x: drag.origin.x + pointer.room.x - drag.grab.room.x,
            y: drag.origin.y + pointer.room.y - drag.grab.room.y,
        },
    };
};
