import { describe, expect, it } from "vitest";

import { pick } from "./plan-selection";

describe("pick", () => {
    it("selects only the table clicked, and lets it go on a second click", () => {
        expect(pick(["t1", "t2"], "t3", false)).toEqual(["t3"]);
        expect(pick(["t3"], "t3", false)).toEqual([]);
    });

    it("adds a table with Ctrl or ⌘ held, and takes it back out", () => {
        expect(pick(["t1"], "t2", true)).toEqual(["t1", "t2"]);
        expect(pick(["t1", "t2"], "t1", true)).toEqual(["t2"]);
    });

    it("never mixes the couple's table or the entrance with tables", () => {
        expect(pick(["t1", "t2"], "entrance", true)).toEqual(["entrance"]);
        expect(pick(["head"], "t1", true)).toEqual(["t1"]);
    });
});
