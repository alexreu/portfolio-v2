"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import { motion, MotionConfig, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { sealInitials } from "@/lib/wedding-dashboard/drafts";
import type { SealTone } from "@/lib/wedding-dashboard/types";

import { OliveSprig } from "./olive-sprig";

/**
 * The Signature opening, in seconds from the touch on the seal. On the guest site the page
 * takes over at `handOver`, then the overlay fades: 3.5 s in all. The card holds still
 * for half a second once both olive branches are drawn, so they can be seen.
 */
export const envelopeTimeline = {
    flap: 0.15,
    rise: 0.6,
    forward: 1.2,
    sprig: 1.3,
    handOver: 3,
} as const;

const at = envelopeTimeline;

const inOut = [0.65, 0, 0.35, 1] as const;
const out = [0.22, 1, 0.36, 1] as const;
const gravity = [0.5, 0, 0.75, 0] as const;

/** The seal cracks along a jagged line; each half tips over and falls away. */
const crack = {
    left: "polygon(0 0, 53% 0, 46% 31%, 55% 54%, 47% 77%, 52% 100%, 0 100%)",
    right: "polygon(53% 0, 100% 0, 100% 100%, 52% 100%, 47% 77%, 55% 54%, 46% 31%)",
} as const;

/** The whole seal hides the seam between the halves until it breaks. */
const sealWhole: Variants = {
    closed: { opacity: 1 },
    open: { opacity: 0, transition: { duration: 0 } },
};

const sealHalf = (side: -1 | 1): Variants => ({
    closed: { x: 0, y: 0, rotate: 0, opacity: 1 },
    open: {
        x: side * 18,
        y: 40,
        rotate: side * 30,
        opacity: 0,
        transition: {
            duration: 0.5,
            ease: out,
            y: { duration: 0.5, ease: gravity },
            opacity: { duration: 0.2, delay: 0.3 },
        },
    },
});

/** Once the card is out, the envelope drops away below it. */
const falling = {
    y: { delay: at.forward, duration: 0.6, ease: gravity },
    opacity: { delay: at.forward + 0.1, duration: 0.45 },
};

const envelopePart: Variants = {
    closed: { y: "0%", opacity: 1 },
    open: { y: "30%", opacity: 0, transition: falling },
};

/**
 * Hinged on the top edge. Its faces fade instead of the flap itself: Chrome flattens a
 * 3D element that has an opacity animation pending, and the lining never shows.
 */
const flap: Variants = {
    closed: { rotateX: 0, y: "0%" },
    open: {
        rotateX: 180,
        y: "30%",
        transition: { rotateX: { delay: at.flap, duration: 0.6, ease: inOut }, y: falling.y },
    },
};

const flapFace: Variants = {
    closed: { opacity: 1 },
    open: { opacity: 0, transition: falling.opacity },
};

/** Slides out of the pocket, then comes forward over the envelope. */
const card: Variants = {
    closed: { y: "0%", scale: 1 },
    open: {
        y: ["0%", "-112%", "-4%"],
        scale: [1, 1, 1.18],
        transition: { delay: at.rise, duration: 1.2, times: [0, 0.5, 1], ease: [out, inOut] },
    },
};

/**
 * Stacking order changes twice: the flap passes behind the card at 90°, then the card
 * passes in front of the pocket once out. Motion skips the delay of a zero-length zIndex
 * transition, so timers drive these steps instead.
 */
type Layering = "sealed" | "flap-open" | "card-out";

const ENVELOPE_V = "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)";
const FLAP = "polygon(0 0, 100% 0, 50% 56%)";

/** Wax and lining colours; the couple picks one in their dashboard. */
const tones: Record<SealTone, CSSProperties> = {
    olive: { "--seal": "var(--demo-olive)", "--seal-dark": "var(--demo-olive-dark)" },
    terre: { "--seal": "var(--demo-earth)", "--seal-dark": "var(--demo-earth-dark)" },
    encre: { "--seal": "var(--demo-ink-2)", "--seal-dark": "var(--demo-ink)" },
} as Record<SealTone, CSSProperties>;

/** Wax seal with the couple's initials and two pressed olive leaves. */
const SealFace = ({ initials }: { initials: string }) => {
    const wax = useId();
    return (
        <svg viewBox="0 0 100 100" className="size-full overflow-visible">
            <defs>
                <radialGradient id={wax} cx="38%" cy="32%" r="70%">
                    <stop offset="0%" style={{ stopColor: "var(--seal)" }} />
                    <stop offset="100%" style={{ stopColor: "var(--seal-dark)" }} />
                </radialGradient>
            </defs>
            <path
                d="M50 3C62 2 70 8 79 12C88 17 95 27 96 38C98 49 99 58 95 68C91 79 84 87 74 92C64 97 55 98 45 97C34 96 24 92 16 85C8 77 3 67 2 56C1 45 3 34 9 25C15 15 25 8 36 5C41 4 45 3 50 3Z"
                fill={`url(#${wax})`}
            />
            <circle
                cx="50"
                cy="50"
                r="34"
                fill="none"
                strokeWidth="1.6"
                className="stroke-(--seal-dark)"
            />
            <circle
                cx="50"
                cy="50"
                r="31.5"
                fill="none"
                strokeWidth="0.8"
                className="stroke-demo-card/25"
            />
            <text
                x="50"
                y="55"
                textAnchor="middle"
                className="font-demo-serif fill-demo-card text-[23px] italic"
            >
                {initials}
            </text>
            <path d="M50 70C46 66 40 66 37 68C40 71 46 72 50 70Z" className="fill-demo-card/45" />
            <path d="M50 70C54 66 60 66 63 68C60 71 54 72 50 70Z" className="fill-demo-card/45" />
        </svg>
    );
};

type InvitationEnvelopeProps = {
    first: string;
    second: string;
    dateLabel: string;
    tone: SealTone;
    /** Starts the opening; the parent decides what touching the seal does. */
    opening: boolean;
    onSealTouched: () => void;
    sealLabel: string;
    /** The overlay titles its dialog with the card; the dashboard preview does not. */
    title: { as: "h1"; id: string } | { as: "p" };
    className?: string;
};

/** The faire-part in its envelope: seal, flap, card and the olive sprig drawn on it. */
export const InvitationEnvelope = ({
    first,
    second,
    dateLabel,
    tone,
    opening,
    onSealTouched,
    sealLabel,
    title,
    className,
}: InvitationEnvelopeProps) => {
    const [layering, setLayering] = useState<Layering>("sealed");
    const initials = sealInitials(first, second);
    const Title = title.as;

    useEffect(() => {
        if (!opening) return;
        const timers = [
            window.setTimeout(() => setLayering("flap-open"), (at.flap + 0.3) * 1_000),
            window.setTimeout(() => setLayering("card-out"), at.forward * 1_000),
        ];
        return () => timers.forEach((timer) => window.clearTimeout(timer));
    }, [opening]);

    return (
        <MotionConfig reducedMotion="user">
            <motion.div
                initial={false}
                animate={opening ? "open" : "closed"}
                style={tones[tone]}
                className={cn("relative aspect-[10/6.8] perspective-[1400px]", className)}
            >
                <motion.div
                    variants={envelopePart}
                    className="shadow-demo-ink/25 absolute inset-0 z-0 rounded-[3px] bg-(--seal) shadow-2xl"
                />

                <motion.div
                    variants={card}
                    className={cn(
                        layering === "card-out" ? "z-5" : "z-2",
                        "bg-demo-card shadow-demo-ink/15 @container absolute inset-x-[6%] top-[7%] flex h-[86%] flex-col items-center justify-center px-4 text-center shadow-lg",
                    )}
                >
                    <span
                        aria-hidden="true"
                        className="border-demo-line pointer-events-none absolute inset-1.5 border"
                    />
                    <OliveSprig startsAt={at.sprig} className="w-[38cqw]" />
                    <Title
                        id={title.as === "h1" ? title.id : undefined}
                        className="font-demo-script mt-[1.5cqw] text-[12.5cqw] leading-[1.15] font-normal whitespace-nowrap"
                    >
                        {first}{" "}
                        <span className="font-demo-serif text-demo-earth-dark text-[0.5em] italic">
                            &amp;
                        </span>{" "}
                        {second}
                    </Title>
                    <p className="text-demo-ink-2 mt-[1.5cqw] text-[max(0.75rem,3.2cqw)]">
                        {dateLabel}
                    </p>
                </motion.div>

                <motion.div variants={envelopePart} className="absolute inset-0 z-3">
                    <div className="drop-shadow-demo-ink/20 absolute inset-0 drop-shadow-sm">
                        <div
                            className="bg-demo-card absolute inset-0"
                            style={{ clipPath: ENVELOPE_V }}
                        />
                    </div>
                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="absolute inset-0 size-full"
                    >
                        <path
                            d="M0 100L44 57M100 100L56 57"
                            fill="none"
                            vectorEffect="non-scaling-stroke"
                            className="stroke-demo-line"
                        />
                    </svg>
                </motion.div>

                <motion.div
                    variants={flap}
                    className={cn(
                        layering === "sealed" ? "z-4" : "z-1",
                        "absolute inset-0 origin-top transform-3d",
                    )}
                >
                    <motion.div
                        variants={flapFace}
                        className="drop-shadow-demo-ink/25 absolute inset-0 drop-shadow-md backface-hidden"
                    >
                        <div
                            className="from-demo-card to-demo-paper-2 absolute inset-0 bg-linear-to-b"
                            style={{ clipPath: FLAP }}
                        />
                    </motion.div>
                    <motion.div
                        variants={flapFace}
                        className="absolute inset-0 rotate-y-180 bg-(--seal-dark) backface-hidden"
                        style={{ clipPath: FLAP }}
                    />
                </motion.div>

                <motion.button
                    type="button"
                    onClick={onSealTouched}
                    disabled={opening}
                    aria-label={sealLabel}
                    whileHover={opening ? undefined : { scale: 1.05 }}
                    whileTap={opening ? undefined : { scale: 0.93 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="drop-shadow-demo-ink/30 absolute top-[56%] left-1/2 z-6 aspect-square w-[clamp(4.25rem,20%,5.5rem)] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full drop-shadow-md disabled:cursor-default"
                >
                    {(["left", "right"] as const).map((side) => (
                        <motion.span
                            key={side}
                            variants={sealHalf(side === "left" ? -1 : 1)}
                            aria-hidden="true"
                            className="absolute inset-0"
                            style={{ clipPath: crack[side] }}
                        >
                            <SealFace initials={initials} />
                        </motion.span>
                    ))}
                    <motion.span
                        variants={sealWhole}
                        aria-hidden="true"
                        className="absolute inset-0"
                    >
                        <SealFace initials={initials} />
                    </motion.span>
                </motion.button>
            </motion.div>
        </MotionConfig>
    );
};
