"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab inside a modal layer drawn by hand, and gives the focus back to what held it once
 * the layer is gone: what Radix dialogs do on their own.
 */
export const useFocusTrap = (layer: RefObject<HTMLElement | null>) => {
    useEffect(() => {
        const before = document.activeElement as HTMLElement | null;
        const keepInside = (event: KeyboardEvent) => {
            const element = layer.current;
            if (event.key !== "Tab" || !element) return;
            const items = [...element.querySelectorAll<HTMLElement>(FOCUSABLE)];
            if (items.length === 0) {
                event.preventDefault();
                element.focus();
                return;
            }
            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;
            const outside = !element.contains(active);
            if (event.shiftKey && (active === first || active === element || outside)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (active === last || outside)) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", keepInside);
        return () => {
            document.removeEventListener("keydown", keepInside);
            if (before?.isConnected) before.focus({ preventScroll: true });
        };
    }, [layer]);
};
