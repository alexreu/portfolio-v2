"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";

/**
 * Same-page links scroll with Lenis and only rewrite the address: no fragment navigation for
 * the browser or the router to react to, which on some phones replayed the faire-part.
 */
export const useAnchorScroll = (offset = -64) => {
    const lenis = useLenis();
    return useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            const hash = event.currentTarget.hash;
            if (!hash || event.metaKey || event.ctrlKey || event.shiftKey) return;
            const target = document.querySelector(hash);
            if (!target) return;
            event.preventDefault();
            if (lenis) lenis.scrollTo(target as HTMLElement, { offset });
            else target.scrollIntoView({ behavior: "smooth" });
            window.history.replaceState(window.history.state, "", hash);
        },
        [lenis, offset],
    );
};
