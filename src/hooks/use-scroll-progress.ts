"use client";

import { useMotionValue } from "motion/react";
import { useLenis } from "lenis/react";

/**
 * Returns a MotionValue that tracks Lenis scroll progress (0 to 1).
 * Use with `useTransform` for scroll-linked animations.
 *
 * @example
 * const progress = useScrollProgress();
 * const opacity = useTransform(progress, [0, 0.5], [1, 0]);
 */
export function useScrollProgress() {
    const progress = useMotionValue(0);

    useLenis((lenis) => {
        progress.set(lenis.progress);
    });

    return progress;
}

/**
 * Returns a MotionValue that tracks raw scroll position in pixels.
 * Use with `useTransform` for parallax effects.
 *
 * @example
 * const scrollY = useScrollY();
 * const y = useTransform(scrollY, [0, 500], [0, -100]);
 */
export function useScrollY() {
    const scrollY = useMotionValue(0);

    useLenis((lenis) => {
        scrollY.set(lenis.scroll);
    });

    return scrollY;
}
