import { describe, expect, it } from "vitest";

import { pageBadge, planBadge } from "./badges";

describe("planBadge", () => {
    it("says from which formula a function comes, and as which option", () => {
        expect(planBadge("reminders")).toEqual({ from: "Essentiel", note: "Dès Essentiel" });
        expect(planBadge("gallery")).toEqual({ from: "Essentiel", note: "Dès Essentiel · option Intime" });
        expect(planBadge("seating")).toEqual({ from: "Signature", note: "Signature · option Essentiel" });
        expect(planBadge("collaborators")?.note).toBe("Signature · option Intime et Essentiel");
    });

    it("says nothing for a function every formula has", () => {
        expect(planBadge("guests")).toBeUndefined();
    });
});

describe("pageBadge", () => {
    it("marks the pages of functions not every formula has", () => {
        expect(pageBadge("seating")?.from).toBe("Signature");
        expect(pageBadge("access")?.from).toBe("Signature");
        expect(pageBadge("guests")).toBeUndefined();
        expect(pageBadge(null)).toBeUndefined();
    });
});
