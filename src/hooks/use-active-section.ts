"use client";

import { useEffect, useState } from "react";

import { activeSection } from "@/lib/wedding-demo/active-section";

/** "#top" is the whole page: the menu means its first block, the hero or the thanks. */
const elementOf = (id: string) =>
    id === "top" ? document.getElementById(id)?.firstElementChild : document.getElementById(id);

/**
 * The menu link of the section being read, "#lieux", or null. Measured once a frame at most
 * while the page scrolls: a few boxes, nothing the scroll waits for.
 */
export const useActiveSection = (hrefs: readonly string[]) => {
    const [active, setActive] = useState<string | null>(null);
    const key = hrefs.join(" ");

    useEffect(() => {
        const ids = key
            .split(" ")
            .filter((href) => href.startsWith("#"))
            .map((href) => href.slice(1));
        let frame = 0;
        const measure = () => {
            frame = 0;
            const boxes = ids.flatMap((id) => {
                const box = elementOf(id)?.getBoundingClientRect();
                return box ? [{ id, top: box.top, bottom: box.bottom }] : [];
            });
            const viewport = window.innerHeight;
            const atEnd = window.scrollY + viewport >= document.documentElement.scrollHeight - 2;
            const id = activeSection(boxes, { line: viewport * 0.4, viewport, atEnd });
            setActive(id === null ? null : `#${id}`);
        };
        const schedule = () => {
            if (frame === 0) frame = requestAnimationFrame(measure);
        };
        schedule();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, [key]);

    return active;
};
