"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame } from "motion/react";

type SmoothScrollProps = {
    children: ReactNode;
};

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
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
                anchors: true,
            }}
        >
            {children}
        </ReactLenis>
    );
};

export { useLenis };
