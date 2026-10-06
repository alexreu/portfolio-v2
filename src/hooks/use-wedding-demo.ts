"use client";

import { useSyncExternalStore } from "react";
import { DEMO_STORAGE_KEY, demoSeed } from "@/content/wedding-dashboard-demo";

import { createDemoStore, type DemoStore } from "@/lib/wedding-dashboard/store";

const browserStorage = () => {
    try {
        return window.localStorage;
    } catch {
        return null;
    }
};

let store: DemoStore | null = null;

/** One store per page, created in the browser only. */
const demoStore = () =>
    (store ??= createDemoStore({
        storage: browserStorage(),
        key: DEMO_STORAGE_KEY,
        seed: () => demoSeed(new Date()),
    }));

/** Also wakes up when the guest site, open in another tab, saves an answer. */
const subscribe = (listener: () => void) => {
    const unsubscribe = demoStore().subscribe(listener);
    const onStorage = (event: StorageEvent) => {
        if (event.key === DEMO_STORAGE_KEY || event.key === null) demoStore().refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => {
        unsubscribe();
        window.removeEventListener("storage", onStorage);
    };
};

const getSnapshot = () => demoStore().getSnapshot();

/** The server knows nothing of the visitor's browser: null until hydrated. */
const getServerSnapshot = () => null;

/** Stable references, safe in effect dependencies. */
const dispatch: DemoStore["dispatch"] = (action) => demoStore().dispatch(action);
const reset = () => demoStore().reset();

/**
 * The demo's shared state: the couple's dashboard and the guest site read and write the
 * same copy, kept in this browser only.
 */
export const useWeddingDemo = () => {
    const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return { state, dispatch, reset };
};
