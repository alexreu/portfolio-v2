"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame } from "motion/react";

type SmoothScrollProps = {
    children: ReactNode;
    /** Height kept free above an anchor target, for the fixed or sticky header. */
    anchorOffset?: number;
};

export const SmoothScroll = ({ children, anchorOffset = 96 }: SmoothScrollProps) => {
    const lenisRef = useRef<LenisRef>(null);

    // Sync Lenis RAF with Motion's frame scheduler — single frame loop
    useEffect(() => {
        const update = (data: { timestamp: number }) => {
            lenisRef.current?.lenis?.raf(data.timestamp);
        };

        frame.update(update, true);

        return () => cancelFrame(update);
    }, []);

    return (
        <ReactLenis
            ref={lenisRef}
            root
            options={{
                lerp: 0.1,
                duration: 1,
                smoothWheel: true,
                /**
                 * A finger scrolls the page natively, with the phone's own momentum: smoothing
                 * it lags behind the finger. The wheel stays smoothed, anchors still glide.
                 */
                syncTouch: false,
                autoRaf: false, // We sync with Motion's frame loop instead
                anchors: { offset: -anchorOffset },
            }}
        >
            {children}
        </ReactLenis>
    );
};

export { useLenis };
