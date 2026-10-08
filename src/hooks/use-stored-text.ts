"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
/** What was typed on this page, which holds even when the browser refuses to store it. */
const memory = new Map<string, string | null>();

const read = (key: string) => {
    if (memory.has(key)) return memory.get(key) ?? null;
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", listener);
    };
};

/**
 * A short text this visitor gave once, such as their name, kept in this browser. Undefined on
 * the server, where it cannot be known yet; null when nothing is stored.
 */
export const useStoredText = (key: string) => {
    const value = useSyncExternalStore<string | null | undefined>(
        subscribe,
        () => read(key),
        () => undefined,
    );
    const set = useCallback(
        (next: string | null) => {
            memory.set(key, next);
            try {
                if (next === null) window.localStorage.removeItem(key);
                else window.localStorage.setItem(key, next);
            } catch {
                /* Storage refused: the text stays in memory. */
            }
            listeners.forEach((listener) => listener());
        },
        [key],
    );
    return [value, set] as const;
};
