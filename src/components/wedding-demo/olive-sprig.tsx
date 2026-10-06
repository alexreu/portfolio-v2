"use client";

import { motion, type Transition, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * One half of the sprig, in a 120 × 48 box, drawn from the centre bottom out to the left.
 * Olive leaves grow in opposite pairs; `angle` is in degrees, the leaf drawn along +x.
 */
const leaves = [
    { x: 45.4, y: 39.8, angle: 248, order: 0, tone: "light" },
    { x: 45.4, y: 39.8, angle: 158, order: 1, tone: "dark" },
    { x: 32.3, y: 33, angle: 257, order: 2, tone: "light" },
    { x: 32.3, y: 33, angle: 167, order: 3, tone: "dark" },
    { x: 19.5, y: 23.2, angle: 268, order: 4, tone: "light" },
    { x: 19.5, y: 23.2, angle: 178, order: 5, tone: "dark" },
    { x: 8, y: 10, angle: 235, order: 6, tone: "light" },
] as const;

const STEM = "M58 44C42 40 22 30 8 10";
const LEAF = "M0 0C3.5-3 10.5-3.2 14 0C10.5 3.2 3.5 3 0 0Z";

const settle = [0.22, 1, 0.36, 1] as const;

const stem = (startsAt: number): Variants => ({
    closed: { pathLength: 0, opacity: 0 },
    open: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { delay: startsAt, duration: 0.7, ease: [0.65, 0, 0.35, 1] },
            opacity: { delay: startsAt, duration: 0.01 },
        },
    },
});

const grown = (startsAt: number, order: number): Variants => {
    const transition: Transition = {
        delay: startsAt + 0.15 + order * 0.07,
        duration: 0.45,
        ease: settle,
    };
    return {
        closed: { scale: 0, opacity: 0 },
        open: { scale: 1, opacity: 1, transition },
    };
};

type OliveSprigProps = {
    /** Seconds after the parent switches to its `open` variant. */
    startsAt: number;
    className?: string;
};

const Half = ({ startsAt }: { startsAt: number }) => (
    <>
        <motion.path
            d={STEM}
            variants={stem(startsAt)}
            fill="none"
            strokeWidth={1.1}
            strokeLinecap="round"
            className="stroke-demo-olive-dark"
        />
        {leaves.map((leaf) => (
            <g key={leaf.order} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle})`}>
                <motion.path
                    d={LEAF}
                    variants={grown(startsAt, leaf.order)}
                    style={{ originX: 0, originY: 0.5 }}
                    className={leaf.tone === "light" ? "fill-demo-olive" : "fill-demo-olive-dark"}
                />
            </g>
        ))}
        <motion.ellipse
            cx={39}
            cy={44.5}
            rx={2.6}
            ry={2}
            variants={grown(startsAt, 3)}
            className="fill-demo-earth-dark"
        />
    </>
);

/** The Domaine des Oliviers sprig: two mirrored branches meeting at the centre. */
export const OliveSprig = ({ startsAt, className }: OliveSprigProps) => (
    <svg viewBox="0 0 120 48" aria-hidden="true" className={cn("overflow-visible", className)}>
        <Half startsAt={startsAt} />
        <g transform="translate(120 0) scale(-1 1)">
            <Half startsAt={startsAt} />
        </g>
    </svg>
);
