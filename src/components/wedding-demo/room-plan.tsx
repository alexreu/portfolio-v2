"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import {
    followPointer,
    startDrag,
    type PlanDrag,
    type PlanPointer,
} from "@/lib/wedding-dashboard/plan-drag";
import { isFixture, type Fixture } from "@/lib/wedding-dashboard/plan-selection";
import {
    ENTRANCE_HALF,
    fixtureInside,
    HEAD_HALF,
    roomDimensions,
    TABLE_RADIUS,
    turned,
} from "@/lib/wedding-dashboard/room";
import type { RoomLayout, RoomPoint, SeatTable } from "@/lib/wedding-dashboard/types";

/** Below this many pixels, a press on an item is a click, not a drag: a finger trembles more. */
const DRAG_THRESHOLD = { mouse: 5, touch: 10 } as const;
const KEY_STEP = 2;

type RoomPlanProps = {
    tables: readonly SeatTable[];
    room: RoomLayout;
    label: string;
    /** The guest's own tables, filled in olive. */
    highlight?: readonly string[];
    /** Tables, the couple's table or the entrance, outlined. */
    selectedIds?: readonly string[];
    /** Guests seated per table, shown under its number in the dashboard. */
    seated?: Readonly<Record<string, number>>;
    /**
     * Given only in the dashboard: items can then be picked and everything moved. `additive`
     * when Ctrl, ⌘ or Shift is held, to pick several tables.
     */
    onSelect?: (item: string, additive: boolean) => void;
    onMove?: (tableId: string, x: number, y: number) => void;
    onMoveFixture?: (fixture: Fixture, x: number, y: number) => void;
    /** Turns the couple's table or the entrance along a side wall, or back. */
    onRotateFixture?: (fixture: Fixture) => void;
    /** A small floating action beside the last item picked. */
    selectedAction?: ReactNode;
    className?: string;
};

const additiveKey = (event: React.PointerEvent | React.KeyboardEvent) =>
    event.ctrlKey || event.metaKey || event.shiftKey;

const keyMoves: Record<string, readonly [number, number]> = {
    ArrowLeft: [-KEY_STEP, 0],
    ArrowRight: [KEY_STEP, 0],
    ArrowUp: [0, -KEY_STEP],
    ArrowDown: [0, KEY_STEP],
};

/** The dinner room: the couple's table, the entrance and the round tables, numbered. */
export const RoomPlan = ({
    tables,
    room,
    label,
    highlight = [],
    selectedIds = [],
    seated,
    onSelect,
    onMove,
    onMoveFixture,
    onRotateFixture,
    selectedAction,
    className,
}: RoomPlanProps) => {
    const svg = useRef<SVGSVGElement>(null);
    /** What is being dragged: a table by its id, or one of the room's fixtures. */
    const [drag, setDrag] = useState<PlanDrag | null>(null);
    const still = useReducedMotion() ?? false;
    const editable = Boolean(onSelect);
    const { width, height } = roomDimensions(room.size);

    const pointer = (event: React.PointerEvent): PlanPointer => {
        const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
            svg.current?.getScreenCTM()?.inverse(),
        );
        return {
            room: { x: (point.x / width) * 100, y: (point.y / height) * 100 },
            screen: { x: event.clientX, y: event.clientY },
        };
    };

    /**
     * Where an item stands, following the pointer while dragged. Fixtures stay whole inside the
     * room, even from a copy saved when they could lean on a wall.
     */
    const at = (item: string, point: RoomPoint): RoomPoint => {
        const dragged = drag?.item === item ? drag.at : point;
        if (!isFixture(item)) return dragged;
        const half = item === "head" ? HEAD_HALF : ENTRANCE_HALF;
        return fixtureInside(room, { ...room[item], ...dragged }, half);
    };

    const units = (point: RoomPoint) => ({
        x: (point.x / 100) * width,
        y: (point.y / 100) * height,
    });

    const commit = (item: string, x: number, y: number) => {
        if (isFixture(item)) onMoveFixture?.(item, x, y);
        else onMove?.(item, x, y);
    };

    const release = () => {
        if (!drag) return;
        if (drag.moved) commit(drag.item, drag.at.x, drag.at.y);
        else onSelect?.(drag.item, drag.additive);
        setDrag(null);
    };

    /** Pointer and keyboard handlers shared by tables and fixtures. */
    const handlers = (item: string, point: RoomPoint) =>
        editable
            ? {
                  tabIndex: 0,
                  className:
                      "cursor-grab touch-none outline-none active:cursor-grabbing [&:focus-visible>*:first-child]:stroke-[2.5] [&:focus-visible>*:first-child]:stroke-demo-ink",
                  onPointerDown: (event: React.PointerEvent<SVGGElement>) => {
                      event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
                      setDrag(
                          startDrag(
                              item,
                              { x: point.x, y: point.y },
                              pointer(event),
                              additiveKey(event),
                          ),
                      );
                  },
                  onKeyDown: (event: React.KeyboardEvent<SVGGElement>) => {
                      if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onSelect?.(item, additiveKey(event));
                      }
                      if (isFixture(item) && event.key.toLowerCase() === "r") {
                          event.preventDefault();
                          onRotateFixture?.(item);
                      }
                      const step = keyMoves[event.key];
                      if (step) {
                          event.preventDefault();
                          commit(item, point.x + step[0], point.y + step[1]);
                      }
                  },
              }
            : {};

    const head = units(at("head", room.head));
    const entrance = units(at("entrance", room.entrance));
    const headHalf = turned(HEAD_HALF, room.head);
    const entranceHalf = turned(ENTRANCE_HALF, room.entrance);

    /** The floating action sits on the top right corner of the last item picked. */
    const anchorId = selectedIds.at(-1);
    const anchorTable = tables.find((table) => table.id === anchorId);
    const anchor =
        anchorId && isFixture(anchorId)
            ? {
                  ...at(anchorId, room[anchorId]),
                  half: anchorId === "head" ? headHalf : entranceHalf,
              }
            : anchorTable
              ? {
                    ...at(anchorTable.id, anchorTable),
                    half: { width: TABLE_RADIUS * 0.85, height: TABLE_RADIUS * 0.85 },
                }
              : null;
    const outline = (item: string) =>
        selectedIds.includes(item) ? "stroke-demo-ink stroke-[1.5]" : null;
    const sideways = (fixture: Fixture) =>
        room[fixture].rotation === 90 ? ", le long d'un mur" : "";

    return (
        <div className={cn("overflow-x-auto overscroll-x-contain", className)}>
            {/* The plan fits its column; only a phone keeps a large room wide enough to touch. */}
            <div
                className="relative max-sm:min-w-(--plan-min-width)"
                style={
                    {
                        "--plan-min-width":
                            editable && room.size !== "s" ? `${width * 0.9}px` : "0px",
                    } as React.CSSProperties
                }
            >
                <svg
                    ref={svg}
                    viewBox={`0 0 ${width} ${height}`}
                    role={editable ? "group" : "img"}
                    aria-label={label}
                    className="block h-auto w-full select-none"
                    onPointerMove={(event) => {
                        if (!drag) return;
                        const threshold =
                            event.pointerType === "touch"
                                ? DRAG_THRESHOLD.touch
                                : DRAG_THRESHOLD.mouse;
                        const next = followPointer(drag, pointer(event), threshold);
                        if (next !== drag) setDrag(next);
                    }}
                    onPointerUp={release}
                    onPointerCancel={() => setDrag(null)}
                >
                    <rect
                        x="1"
                        y="1"
                        width={width - 2}
                        height={height - 2}
                        rx="4"
                        className="fill-demo-card stroke-demo-line"
                    />
                    <g
                        transform={`translate(${head.x} ${head.y})`}
                        aria-label={
                            editable
                                ? `Table des mariés${sideways("head")} : glissez-la pour la déplacer, R pour la pivoter`
                                : undefined
                        }
                        role={editable ? "button" : undefined}
                        aria-pressed={editable ? selectedIds.includes("head") : undefined}
                        {...handlers("head", room.head)}
                    >
                        <rect
                            x={-headHalf.width}
                            y={-headHalf.height}
                            width={headHalf.width * 2}
                            height={headHalf.height * 2}
                            rx="2"
                            className={cn(
                                "fill-demo-paper-2",
                                outline("head") ?? "stroke-transparent",
                            )}
                        />
                        <text
                            y="3.5"
                            textAnchor="middle"
                            transform={room.head.rotation === 90 ? "rotate(-90)" : undefined}
                            className="fill-demo-muted text-[10px]"
                        >
                            Mariés
                        </text>
                    </g>
                    <g
                        transform={`translate(${entrance.x} ${entrance.y})`}
                        aria-label={
                            editable
                                ? `Entrée${sideways("entrance")} : glissez-la pour la déplacer, R pour la pivoter`
                                : undefined
                        }
                        role={editable ? "button" : undefined}
                        aria-pressed={editable ? selectedIds.includes("entrance") : undefined}
                        {...handlers("entrance", room.entrance)}
                    >
                        <rect
                            x={-entranceHalf.width}
                            y={-entranceHalf.height}
                            width={entranceHalf.width * 2}
                            height={entranceHalf.height * 2}
                            rx="8"
                            className={cn(
                                editable
                                    ? cn(
                                          "fill-demo-paper",
                                          outline("entrance") ?? "stroke-demo-line",
                                      )
                                    : "fill-transparent stroke-transparent",
                            )}
                        />
                        <text
                            y="3.5"
                            textAnchor="middle"
                            transform={room.entrance.rotation === 90 ? "rotate(-90)" : undefined}
                            className="fill-demo-muted text-[10px]"
                        >
                            Entrée · {room.name}
                        </text>
                    </g>
                    {tables.map((table) => {
                        const { x, y } = units(at(table.id, table));
                        const own = highlight.includes(table.id);
                        const isSelected = selectedIds.includes(table.id);
                        const count = seated?.[table.id];
                        const over = count !== undefined && count > table.capacity;
                        return (
                            <g
                                key={table.id}
                                transform={`translate(${x} ${y})`}
                                role={editable ? "button" : undefined}
                                aria-pressed={editable ? isSelected : undefined}
                                aria-label={
                                    editable
                                        ? `Table ${table.number}, ${table.name}, ${count ?? 0} sur ${table.capacity} places`
                                        : undefined
                                }
                                {...handlers(table.id, table)}
                            >
                                <circle
                                    r={TABLE_RADIUS}
                                    className={cn(
                                        own ? "fill-demo-olive" : "fill-demo-paper-2",
                                        isSelected
                                            ? "stroke-demo-ink stroke-[1.5]"
                                            : over
                                              ? "stroke-demo-no stroke-[1.5]"
                                              : "stroke-demo-line",
                                    )}
                                />
                                <text
                                    y={count === undefined ? 5 : 2}
                                    textAnchor="middle"
                                    className={cn(
                                        "text-[13px]",
                                        own ? "fill-demo-card" : "fill-demo-ink",
                                    )}
                                >
                                    {table.number}
                                </text>
                                {count !== undefined && (
                                    <text
                                        y="10"
                                        textAnchor="middle"
                                        className={cn(
                                            "text-[6.5px]",
                                            over ? "fill-demo-no" : "fill-demo-muted",
                                        )}
                                    >
                                        {count}/{table.capacity}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
                <AnimatePresence>
                    {selectedAction && anchor && !drag?.moved && (
                        <motion.div
                            key={anchorId}
                            initial={{ opacity: 0, scale: still ? 1 : 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: still ? 1 : 0.6 }}
                            transition={{ type: "spring", stiffness: 500, damping: 28 }}
                            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: `${anchor.x + (anchor.half.width / width) * 100}%`,
                                top: `${anchor.y - (anchor.half.height / height) * 100}%`,
                            }}
                        >
                            {selectedAction}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
