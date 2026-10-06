"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import {
    ENTRANCE_HALF,
    HEAD_HALF,
    roomDimensions,
    TABLE_RADIUS,
} from "@/lib/wedding-dashboard/room";
import type { RoomLayout, RoomPoint, SeatTable } from "@/lib/wedding-dashboard/types";

/** Below this many room units, a press on an item is a click, not a drag. */
const DRAG_THRESHOLD = 2;
const KEY_STEP = 2;

type Fixture = "head" | "entrance";

type RoomPlanProps = {
    tables: readonly SeatTable[];
    room: RoomLayout;
    label: string;
    /** The guest's own tables, filled in olive. */
    highlight?: readonly string[];
    selectedId?: string | null;
    /** Guests seated per table, shown under its number in the dashboard. */
    seated?: Readonly<Record<string, number>>;
    /** Given only in the dashboard: tables can then be picked and everything moved. */
    onSelect?: (tableId: string) => void;
    onMove?: (tableId: string, x: number, y: number) => void;
    onMoveFixture?: (fixture: Fixture, x: number, y: number) => void;
    /** A small floating action beside the selected table. */
    selectedAction?: ReactNode;
    className?: string;
};

/** What is being dragged: a table by its id, or one of the room's fixtures. */
type Drag = {
    readonly item: string;
    readonly x: number;
    readonly y: number;
    readonly moved: boolean;
};

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
    selectedId = null,
    seated,
    onSelect,
    onMove,
    onMoveFixture,
    selectedAction,
    className,
}: RoomPlanProps) => {
    const svg = useRef<SVGSVGElement>(null);
    const [drag, setDrag] = useState<Drag | null>(null);
    const still = useReducedMotion() ?? false;
    const editable = Boolean(onSelect);
    const { width, height } = roomDimensions(room.size);

    const toPercent = (clientX: number, clientY: number) => {
        const point = new DOMPoint(clientX, clientY).matrixTransform(
            svg.current?.getScreenCTM()?.inverse(),
        );
        return { x: (point.x / width) * 100, y: (point.y / height) * 100 };
    };

    const at = (item: string, point: RoomPoint) =>
        drag?.item === item ? { x: drag.x, y: drag.y } : point;

    const units = (point: RoomPoint) => ({
        x: (point.x / 100) * width,
        y: (point.y / 100) * height,
    });

    const commit = (item: string, x: number, y: number) => {
        if (item === "head" || item === "entrance") onMoveFixture?.(item, x, y);
        else onMove?.(item, x, y);
    };

    const release = () => {
        if (!drag) return;
        if (drag.moved) commit(drag.item, drag.x, drag.y);
        else if (drag.item !== "head" && drag.item !== "entrance") onSelect?.(drag.item);
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
                      setDrag({ item, x: point.x, y: point.y, moved: false });
                  },
                  onKeyDown: (event: React.KeyboardEvent<SVGGElement>) => {
                      if (
                          (event.key === "Enter" || event.key === " ") &&
                          item !== "head" &&
                          item !== "entrance"
                      ) {
                          event.preventDefault();
                          onSelect?.(item);
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
    const selected = tables.find((table) => table.id === selectedId);
    const selectedAt = selected ? at(selected.id, selected) : null;

    return (
        <div className={cn("overflow-x-auto overscroll-x-contain", className)}>
            <div
                className="relative"
                style={{
                    minWidth: editable && room.size !== "s" ? `${width * 1.15}px` : undefined,
                }}
            >
                <svg
                    ref={svg}
                    viewBox={`0 0 ${width} ${height}`}
                    role={editable ? "group" : "img"}
                    aria-label={label}
                    className="block h-auto w-full select-none"
                    onPointerMove={(event) => {
                        if (!drag) return;
                        const { x, y } = toPercent(event.clientX, event.clientY);
                        const moved =
                            drag.moved ||
                            Math.hypot(
                                ((x - drag.x) / 100) * width,
                                ((y - drag.y) / 100) * height,
                            ) > DRAG_THRESHOLD;
                        if (moved) setDrag({ ...drag, x, y, moved: true });
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
                            editable ? "Table des mariés : glissez-la pour la déplacer" : undefined
                        }
                        role={editable ? "button" : undefined}
                        {...handlers("head", room.head)}
                    >
                        <rect
                            x={-HEAD_HALF.width}
                            y={-HEAD_HALF.height}
                            width={HEAD_HALF.width * 2}
                            height={HEAD_HALF.height * 2}
                            rx="2"
                            className="fill-demo-paper-2 stroke-transparent"
                        />
                        <text y="3.5" textAnchor="middle" className="fill-demo-muted text-[10px]">
                            Mariés
                        </text>
                    </g>
                    <g
                        transform={`translate(${entrance.x} ${entrance.y})`}
                        aria-label={editable ? "Entrée : glissez-la pour la déplacer" : undefined}
                        role={editable ? "button" : undefined}
                        {...handlers("entrance", room.entrance)}
                    >
                        <rect
                            x={-ENTRANCE_HALF.width}
                            y={-ENTRANCE_HALF.height}
                            width={ENTRANCE_HALF.width * 2}
                            height={ENTRANCE_HALF.height * 2}
                            rx="8"
                            className={cn(
                                editable
                                    ? "fill-demo-paper stroke-demo-line"
                                    : "fill-transparent stroke-transparent",
                            )}
                        />
                        <text y="3.5" textAnchor="middle" className="fill-demo-muted text-[10px]">
                            Entrée · {room.name}
                        </text>
                    </g>
                    {tables.map((table) => {
                        const { x, y } = units(at(table.id, table));
                        const own = highlight.includes(table.id);
                        const isSelected = table.id === selectedId;
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
                    {selectedAction && selectedAt && !drag?.moved && (
                        <motion.div
                            key={selectedId}
                            initial={{ opacity: 0, scale: still ? 1 : 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: still ? 1 : 0.6 }}
                            transition={{ type: "spring", stiffness: 500, damping: 28 }}
                            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: `calc(${selectedAt.x}% + ${(TABLE_RADIUS / width) * 100 * 0.85}%)`,
                                top: `calc(${selectedAt.y}% - ${(TABLE_RADIUS / height) * 100 * 0.85}%)`,
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
