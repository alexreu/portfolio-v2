"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/**
 * Freezes the page behind a modal: Lenis stops and native scrolling is cut.
 *
 * Lenis clips `<html>` while stopped. With `<html>` clipped, a hidden `<body>` (ours, or the
 * one Radix sets for its dialogs) becomes a scroll container of its own, and every sticky
 * element (dashboard sidebar, site nav) jumps back to its place at the top of the page.
 * Keeping `<html>` visible lets `<body>`'s hidden overflow reach the viewport instead:
 * scrolling stays blocked and sticky elements stay where they were.
 */
export const useScrollLock = () => {
    const lenis = useLenis();

    useEffect(() => {
        lenis?.stop();
        const html = document.documentElement;
        const previous = { html: html.style.overflow, body: document.body.style.overflow };
        html.style.overflow = "visible";
        document.body.style.overflow = "hidden";
        return () => {
            html.style.overflow = previous.html;
            document.body.style.overflow = previous.body;
            lenis?.start();
        };
    }, [lenis]);
};
