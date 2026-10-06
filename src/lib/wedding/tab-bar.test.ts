import { describe, expect, it } from "vitest";

import { tabBar } from "./tab-bar";

const summary = (tabs: ReturnType<typeof tabBar>) =>
    tabs.map((tab) => `${tab.label}:${tab.emphasis}`);

describe("tabBar", () => {
    it("puts 'Répondre' forward before the wedding while the household has not answered", () => {
        expect(summary(tabBar("before", { answered: false }))).toEqual([
            "Programme:normal",
            "Lieux:normal",
            "Questions:normal",
            "Répondre:primary",
        ]);
    });

    it("turns 'Répondre' into a plain 'Répondu' tab once the household has answered", () => {
        expect(summary(tabBar("before", { answered: true })).at(-1)).toBe("Répondu:done");
    });

    it("on the wedding day, offers the table and puts photo upload forward", () => {
        expect(summary(tabBar("day", { answered: true }))).toEqual([
            "Programme:normal",
            "Ma table:normal",
            "Ajouter:primary",
            "Lieux:normal",
        ]);
    });
});
