import { describe, expect, it } from "vitest";

import { planOf } from "./plans";

describe("planOf", () => {
    it("leaves the sections every formula has unmarked", () => {
        ["apercu", "invites", "dates", "programme", "faire-part", "traiteur"].forEach((section) =>
            expect(planOf(section)).toBeUndefined(),
        );
    });

    it("marks the reminders as included from Essentiel", () => {
        expect(planOf("relances")).toEqual({
            from: "Essentiel",
            note: "Dès Essentiel",
        });
    });

    it("marks the gallery and the couple's questions as an option with Intime", () => {
        ["galerie", "questions"].forEach((section) =>
            expect(planOf(section)).toEqual({
                from: "Essentiel",
                note: "Dès Essentiel · option Intime",
            }),
        );
    });

    it("marks the seating plan as Signature, an option with Essentiel", () => {
        expect(planOf("plan-de-table")).toEqual({
            from: "Signature",
            note: "Signature · option Essentiel",
        });
    });

    it("marks shared access as Signature, an option with Intime and Essentiel", () => {
        expect(planOf("acces")).toEqual({
            from: "Signature",
            note: "Signature · option Intime et Essentiel",
        });
    });
});
