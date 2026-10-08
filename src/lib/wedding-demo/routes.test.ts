import { describe, expect, it } from "vitest";

import { dashboardHref, pageAt } from "./routes";

describe("dashboard routes", () => {
    it("writes each page's address in French", () => {
        expect(dashboardHref(null)).toBe("/mariage/demo/tableau-de-bord");
        expect(dashboardHref("seating")).toBe("/mariage/demo/tableau-de-bord/plan-de-table");
        expect(dashboardHref("access")).toBe("/mariage/demo/tableau-de-bord/acces");
    });

    it("reads the page back from an address, null for the overview", () => {
        expect(pageAt("/mariage/demo/tableau-de-bord/invites/")).toBe("guests");
        expect(pageAt("/mariage/demo/tableau-de-bord")).toBeNull();
    });
});
