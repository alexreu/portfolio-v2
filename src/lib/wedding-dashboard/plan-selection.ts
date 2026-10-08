export const FIXTURES = ["head", "entrance"] as const;

export type Fixture = (typeof FIXTURES)[number];

export const isFixture = (item: string): item is Fixture =>
    (FIXTURES as readonly string[]).includes(item);

/**
 * What a click on the room plan selects. A plain click keeps the item alone, or nothing when it
 * was already the only one; with Ctrl or ⌘ held a table joins the selection, or leaves it. The
 * couple's table and the entrance cannot be removed, so they are always selected alone.
 */
export const pick = (
    selection: readonly string[],
    item: string,
    additive: boolean,
): readonly string[] => {
    if (additive && !isFixture(item) && !selection.some(isFixture))
        return selection.includes(item)
            ? selection.filter((selected) => selected !== item)
            : [...selection, item];
    return selection.length === 1 && selection[0] === item ? [] : [item];
};
