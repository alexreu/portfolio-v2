import { describe, expect, it } from "vitest";

import { noGrant, templateGrant, withLevel } from "./access";
import { can, canSee, COUPLE, viewerOf } from "./permissions";

const temoin = viewerOf(templateGrant("temoin"));
const planner = viewerOf(templateGrant("planner"));

describe("can", () => {
    it("lets the couple do everything", () => {
        expect(can(COUPLE, "household.remove")).toBe(true);
        expect(can(COUPLE, "access.manage")).toBe(true);
    });

    it("keeps the dashboard's access to the couple alone", () => {
        expect(can(planner, "access.manage")).toBe(false);
    });

    it("asks for « Modifier » on the guests to correct, answer for or remove a household", () => {
        const reading = viewerOf(withLevel(noGrant, "invites", "lecture"));
        const editing = viewerOf(withLevel(noGrant, "invites", "modification"));

        (
            ["household.edit", "household.answer", "household.remove", "household.create"] as const
        ).forEach((action) => {
            expect(can(reading, action)).toBe(false);
            expect(can(editing, action)).toBe(true);
        });
        expect(can(reading, "household.print")).toBe(true);
    });

    it("hands the caterer's sheet and the diets only to whoever may read them", () => {
        const guests = withLevel(noGrant, "invites", "modification");

        expect(can(viewerOf(guests), "export.caterer")).toBe(false);
        expect(can(viewerOf(guests), "diets.read")).toBe(false);
        expect(
            can(viewerOf(withLevel(guests, "invites.regimes", "lecture")), "export.caterer"),
        ).toBe(true);
    });

    it("prints what a person may read, changes what they may modify", () => {
        const gallery = viewerOf(withLevel(noGrant, "galerie", "lecture"));

        expect(can(gallery, "gallery.download")).toBe(true);
        expect(can(gallery, "gallery.print")).toBe(true);
        expect(can(gallery, "gallery.moderate")).toBe(false);
    });
});

describe("canSee", () => {
    it("shows a page when one of its functions is open, the overview always", () => {
        const programme = viewerOf(withLevel(noGrant, "programme", "lecture"));

        expect(canSee(programme, null)).toBe(true);
        expect(canSee(programme, "programme")).toBe(true);
        expect(canSee(programme, "invites")).toBe(false);
        expect(canSee(programme, "acces")).toBe(false);
        expect(canSee(temoin, "acces")).toBe(false);
        expect(canSee(COUPLE, "acces")).toBe(true);
    });
});
