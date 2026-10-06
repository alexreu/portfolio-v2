import { demoReducer, parseDemoState, type DemoAction } from "./state";
import type { DemoState } from "./types";

export type KeyValueStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type DemoStore = {
    readonly getSnapshot: () => DemoState;
    readonly subscribe: (listener: () => void) => () => void;
    readonly dispatch: (action: DemoAction) => void;
    readonly reset: () => void;
    /** Re-reads the browser copy after another tab changed it. */
    readonly refresh: () => void;
};

type Options = {
    /** Null on the server; the browser may also refuse it (private mode, quota). */
    readonly storage: KeyValueStorage | null;
    readonly key: string;
    readonly seed: () => DemoState;
};

/**
 * The demo's only side effects live here: the state is kept in the visitor's browser,
 * nothing leaves it. Snapshots are cached by their stored text, as useSyncExternalStore
 * needs the same object back while nothing changed.
 */
export const createDemoStore = ({ storage, key, seed }: Options): DemoStore => {
    const listeners = new Set<() => void>();
    let cached: { readonly raw: string | null; readonly state: DemoState } | null = null;

    const read = () => {
        try {
            return storage?.getItem(key) ?? null;
        } catch {
            return null;
        }
    };

    const notify = () => listeners.forEach((listener) => listener());

    const getSnapshot = () => {
        const raw = read();
        if (cached && cached.raw === raw) return cached.state;
        cached = { raw, state: parseDemoState(raw) ?? seed() };
        return cached.state;
    };

    const dispatch = (action: DemoAction) => {
        const state = demoReducer(getSnapshot(), action);
        const raw = JSON.stringify(state);
        try {
            storage?.setItem(key, raw);
            cached = { raw, state };
        } catch {
            cached = { raw: read(), state };
        }
        notify();
    };

    const reset = () => {
        try {
            storage?.removeItem(key);
        } catch {
            // Nothing stored, nothing to remove.
        }
        cached = null;
        notify();
    };

    const subscribe = (listener: () => void) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };

    return { getSnapshot, subscribe, dispatch, reset, refresh: notify };
};
