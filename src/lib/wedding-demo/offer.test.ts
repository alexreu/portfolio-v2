import { describe, expect, it } from "vitest";

import { DEFAULT_DEMO_PLAN, demoFlags, demoPlanName, PLAN_PARAMS, planFromParam } from "./offer";

describe("planFromParam", () => {
    it("reads the formula from the French word in the address", () => {
        expect(planFromParam("intime")).toBe("intimate");
        expect(planFromParam("Essentiel")).toBe("essential");
        expect(planFromParam("signature")).toBe("signature");
    });

    it("ignores anything else, so the visitor's choice stays", () => {
        expect(planFromParam("prestige")).toBeNull();
        expect(planFromParam(undefined)).toBeNull();
        expect(planFromParam(["intime", "signature"])).toBe("intimate");
    });

    it("writes each formula back as its address word", () => {
        expect(PLAN_PARAMS.intimate).toBe("intime");
        expect(planFromParam(PLAN_PARAMS.essential)).toBe("essential");
    });
});

describe("demoFlags", () => {
    it("opens what the chosen formula includes, nothing more", () => {
        expect(demoFlags("intimate").has("seating")).toBe(false);
        expect(demoFlags("intimate").has("guests")).toBe(true);
        expect(demoFlags("essential").has("gallery")).toBe(true);
        expect(demoFlags("signature").has("collaborators")).toBe(true);
    });

    it("plays Signature unless the visitor chose another", () => {
        expect(DEFAULT_DEMO_PLAN).toBe("signature");
        expect(demoPlanName("essential")).toBe("Essentiel");
    });
});
