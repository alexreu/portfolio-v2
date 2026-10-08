import { describe, expect, it } from "vitest";

import { romanNumeral } from "./roman";

describe("romanNumeral", () => {
    it("writes the first steps of the guest's experience in Roman capitals", () => {
        expect([1, 2, 3, 4, 5, 6].map(romanNumeral)).toEqual(["I", "II", "III", "IV", "V", "VI"]);
    });

    it("subtracts before ten, forty, ninety and their kin", () => {
        expect(romanNumeral(9)).toBe("IX");
        expect(romanNumeral(14)).toBe("XIV");
        expect(romanNumeral(49)).toBe("XLIX");
        expect(romanNumeral(2027)).toBe("MMXXVII");
    });
});
