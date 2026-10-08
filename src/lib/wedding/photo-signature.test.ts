import { describe, expect, it } from "vitest";

import { signPhoto } from "./photo-signature";

const typed = (firstName: string, lastName: string) => ({ firstName, lastName });

describe("signPhoto", () => {
    it("signs with the household name when the guest came through their personal link", () => {
        expect(signPhoto({ householdName: "Marie Lefèvre", typedName: typed("", "") })).toEqual({
            ok: true,
            value: "Marie Lefèvre",
        });
    });

    it("signs with the typed first and last names, trimmed", () => {
        expect(
            signPhoto({ householdName: null, typedName: typed("  Léa ", " de  La Tour ") }),
        ).toEqual({ ok: true, value: "Léa de La Tour" });
    });

    it("requires a first name of at least two letters and a last name", () => {
        expect(signPhoto({ householdName: null, typedName: typed(" L ", "  ") })).toEqual({
            ok: false,
            error: ["first-name-required", "last-name-required"],
        });
    });

    it("names only what is missing", () => {
        expect(signPhoto({ householdName: null, typedName: typed("Léa", "") })).toEqual({
            ok: false,
            error: ["last-name-required"],
        });
    });
});
