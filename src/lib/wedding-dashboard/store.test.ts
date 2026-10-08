import { describe, expect, it, vi } from "vitest";

import { createDemoStore, type KeyValueStorage } from "./store";
import type { DemoState } from "./types";

const seedState: DemoState = {
    version: 1,
    design: {
        first: "Camille",
        second: "Hugo",
        date: "2027-06-12",
        place: "Luberon",
        welcome: "",
        tone: "olive",
    },
    households: [],
    activity: [],
    photos: [{ id: "p1", src: "/p1.jpg", alt: "", author: "Léa", removed: false }],
    lastReminder: null,
    moments: [],
    questions: [],
    tables: [],
    seats: {},
    room: {
        name: "L'orangerie",
        size: "s",
        head: { x: 50, y: 11, rotation: 0 },
        entrance: { x: 50, y: 96, rotation: 0 },
    },
    dates: { answerDeadline: null, reminder: null, galleryOpens: null },
    collaborators: [],
};

const memoryStorage = (): KeyValueStorage & { data: Map<string, string> } => {
    const data = new Map<string, string>();
    return {
        data,
        getItem: (key) => data.get(key) ?? null,
        setItem: (key, value) => void data.set(key, value),
        removeItem: (key) => void data.delete(key),
    };
};

const brokenStorage: KeyValueStorage = {
    getItem: () => {
        throw new Error("SecurityError");
    },
    setItem: () => {
        throw new Error("QuotaExceededError");
    },
    removeItem: () => {
        throw new Error("SecurityError");
    },
};

const toggle = { type: "photo-toggled", photoId: "p1", at: "2026-10-06T10:00:00+02:00" } as const;

describe("createDemoStore", () => {
    it("starts from the seed and keeps returning the same snapshot", () => {
        const seed = vi.fn(() => seedState);
        const store = createDemoStore({ storage: memoryStorage(), key: "demo", seed });

        expect(store.getSnapshot()).toBe(store.getSnapshot());
        expect(store.getSnapshot()).toEqual(seedState);
        expect(seed).toHaveBeenCalledTimes(1);
    });

    it("saves every change in the browser and tells its listeners", () => {
        const storage = memoryStorage();
        const store = createDemoStore({ storage, key: "demo", seed: () => seedState });
        const listener = vi.fn();
        store.subscribe(listener);

        store.dispatch(toggle);

        expect(store.getSnapshot().photos[0].removed).toBe(true);
        expect(JSON.parse(storage.data.get("demo") ?? "").photos[0].removed).toBe(true);
        expect(listener).toHaveBeenCalledOnce();
    });

    it("picks up what another tab saved", () => {
        const storage = memoryStorage();
        const store = createDemoStore({ storage, key: "demo", seed: () => seedState });
        const other = createDemoStore({ storage, key: "demo", seed: () => seedState });

        other.dispatch(toggle);

        expect(store.getSnapshot().photos[0].removed).toBe(true);
    });

    it("starts over on reset", () => {
        const storage = memoryStorage();
        const store = createDemoStore({ storage, key: "demo", seed: () => seedState });
        store.dispatch(toggle);

        store.reset();

        expect(storage.data.has("demo")).toBe(false);
        expect(store.getSnapshot().photos[0].removed).toBe(false);
    });

    it("still works in memory when the browser refuses storage", () => {
        const store = createDemoStore({
            storage: brokenStorage,
            key: "demo",
            seed: () => seedState,
        });

        store.dispatch(toggle);

        expect(store.getSnapshot().photos[0].removed).toBe(true);
    });
});
