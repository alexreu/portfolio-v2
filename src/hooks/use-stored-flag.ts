"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
/** The choice made on this page, which holds even when the browser refuses to store it. */
const memory = new Map<string, boolean>();

const read = (key: string) => {
    try {
        return memory.get(key) ?? window.localStorage.getItem(key) === "1";
    } catch {
        return false;
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
 * A yes/no preference of this visitor, such as a folded menu, kept in this browser. Off on the
 * server and wherever storage is blocked.
 */
export const useStoredFlag = (key: string) => {
    const value = useSyncExternalStore(
        subscribe,
        () => read(key),
        () => false,
    );
    const set = useCallback(
        (next: boolean) => {
            memory.set(key, next);
            try {
                window.localStorage.setItem(key, next ? "1" : "0");
            } catch {
                /* Storage refused: the choice stays in memory. */
            }
            listeners.forEach((listener) => listener());
        },
        [key],
    );
    return [value, set] as const;
};
