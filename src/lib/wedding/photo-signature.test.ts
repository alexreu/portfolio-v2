import { describe, expect, it } from "vitest";

import { signPhoto } from "./photo-signature";

describe("signPhoto", () => {
    it("signs with the household name when the guest came through their personal link", () => {
        expect(signPhoto({ householdName: "Marie Lefèvre", typedFirstName: "" })).toEqual({
            ok: true,
            value: "Marie Lefèvre",
        });
    });

    it("requires a first name of at least two letters from an unrecognised guest", () => {
        expect(signPhoto({ householdName: null, typedFirstName: " L " })).toEqual({
            ok: false,
            error: "first-name-required",
        });
    });

    it("signs with the typed first name, trimmed, once it is long enough", () => {
        expect(signPhoto({ householdName: null, typedFirstName: "  Léa " })).toEqual({
            ok: true,
            value: "Léa",
        });
    });
});
