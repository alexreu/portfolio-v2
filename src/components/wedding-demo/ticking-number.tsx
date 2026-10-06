"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type TickingNumberProps = {
    value: number | undefined;
    /** Shortest width, padded with zeros: 2 gives "07". */
    minDigits: number;
};

const roll = [0.22, 1, 0.36, 1] as const;

/**
 * Only the digits that change roll: the old one drops out of a mask, the new one falls in.
 * Screen readers get the plain number, never the frames in between.
 */
export const TickingNumber = ({ value, minDigits }: TickingNumberProps) => {
    const instant = useReducedMotion() ?? false;
    const text = value === undefined ? "–" : String(value).padStart(minDigits, "0");

    return (
        <>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true" className="inline-flex overflow-hidden tabular-nums">
                {[...text].map((digit, index) => (
                    // Keyed from the right, so units stay units when 100 days become 99.
                    <span key={text.length - index} className="relative inline-block">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={digit}
                                initial={{ y: "-100%", opacity: 0, filter: "blur(3px)" }}
                                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                                exit={{ y: "100%", opacity: 0, filter: "blur(3px)" }}
                                transition={{ duration: instant ? 0 : 0.5, ease: roll }}
                                className="inline-block"
                            >
                                {digit}
                            </motion.span>
                        </AnimatePresence>
                    </span>
                ))}
            </span>
        </>
    );
};
