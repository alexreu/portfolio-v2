"use client";

import { useSyncExternalStore } from "react";
import { DEMO_STORAGE_KEY, demoSeed } from "@/content/wedding-dashboard-demo";
import { createLocalStore, type DashboardStore } from "@alexreu/wedding-core";

import { demoFlags } from "@/lib/wedding-demo/offer";

import { readDemoPlan } from "./use-demo-plan";

const browserStorage = () => {
    try {
        return window.localStorage;
    } catch {
        return null;
    }
};

/** Short ids for what the visitor creates: households, people, activity entries. */
const newId = () => Math.random().toString(36).slice(2, 8);

let store: DashboardStore | null = null;

/**
 * One store per page, created in the browser only. Commands are the couple's unless the caller
 * says otherwise, as the guest site does.
 */
const demoStore = () =>
    (store ??= createLocalStore({
        storage: browserStorage(),
        key: DEMO_STORAGE_KEY,
        seed: () => demoSeed(new Date()),
        context: () => ({
            at: new Date().toISOString(),
            newId,
            actor: { kind: "couple" },
            flags: demoFlags(readDemoPlan()),
        }),
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
const dispatch: DashboardStore["dispatch"] = (command, overrides) =>
    demoStore().dispatch(command, overrides);
const reset = () => demoStore().reset();

/**
 * The demo's shared state: the couple's dashboard and the guest site read and write the
 * same copy, kept in this browser only.
 */
export const useWeddingDemo = () => {
    const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return { state, dispatch, reset };
};
