const values: readonly (readonly [number, string])[] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
];

/** 4 → "IV": a positive whole number in Roman capitals. */
export const romanNumeral = (count: number): string => {
    const step = values.find(([value]) => value <= count);
    return step ? step[1] + romanNumeral(count - step[0]) : "";
};
