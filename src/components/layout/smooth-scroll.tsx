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
                syncTouch: true,
                syncTouchLerp: 0.06,
                touchMultiplier: 2,
                autoRaf: false, // We sync with Motion's frame loop instead
                anchors: { offset: -anchorOffset },
            }}
        >
            {children}
        </ReactLenis>
    );
};

export { useLenis };
