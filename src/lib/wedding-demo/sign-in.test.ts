import { demoSeed } from "@/content/wedding-dashboard-demo";
import { describe, expect, it } from "vitest";

import { COUPLE_EMAILS, signInTarget } from "./sign-in";

const now = new Date("2026-10-06T15:00:00+02:00");
const state = demoSeed(now);

describe("signInTarget", () => {
    it("lets either of the couple in, whatever the case or spaces", () => {
        expect(signInTarget(state, ` ${COUPLE_EMAILS[1].toUpperCase()} `, now)).toEqual({
            kind: "couple",
        });
    });

    it("lets someone the couple invited in, with their invitation's state", () => {
        expect(signInTarget(state, "elsa.marchand@exemple.fr", now)).toEqual({
            kind: "collaborator",
            id: "elsa",
            firstName: "Elsa",
            status: "active",
        });
        expect(signInTarget(state, "agathe@atelier-agathe.exemple.fr", now)).toMatchObject({
            status: "pending",
        });
        expect(signInTarget(state, "malik.benali@exemple.fr", now)).toMatchObject({
            status: "expired",
        });
    });

    it("knows no one else: no link would leave", () => {
        expect(signInTarget(state, "inconnu@exemple.fr", now)).toBeNull();
        expect(signInTarget(state, "", now)).toBeNull();
    });
});
