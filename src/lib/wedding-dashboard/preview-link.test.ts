import { describe, expect, it } from "vitest";

import { isPreview, previewOf } from "./preview-link";

describe("previewOf", () => {
    it("marks a personal link as the couple's preview", () => {
        expect(previewOf("https://alexdevlab.fr/mariage/demo?foyer=lefevre")).toBe(
            "https://alexdevlab.fr/mariage/demo?foyer=lefevre&apercu",
        );
    });

    it("marks the site's address, keeping an anchor at the end", () => {
        expect(previewOf("/mariage/demo")).toBe("/mariage/demo?apercu");
        expect(previewOf("/mariage/demo?skip#photos")).toBe("/mariage/demo?skip&apercu#photos");
    });

    it("leaves a link already marked as it is", () => {
        expect(previewOf("/mariage/demo?apercu")).toBe("/mariage/demo?apercu");
    });
});

describe("isPreview", () => {
    it("reads the mark from the page's query", () => {
        expect(isPreview({ foyer: "lefevre", apercu: "" })).toBe(true);
        expect(isPreview({ foyer: "lefevre" })).toBe(false);
    });
});
