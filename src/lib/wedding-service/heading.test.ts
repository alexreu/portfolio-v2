import { describe, expect, it } from "vitest";

import { headingParts } from "./heading";

describe("headingParts", () => {
    it("isolates the emphasised words so they can be set in italics", () => {
        expect(
            headingParts({
                text: "Un site à votre image, de l'annonce au dernier souvenir.",
                emphasis: "de l'annonce",
            }),
        ).toEqual([
            { text: "Un site à votre image, ", emphasized: false },
            { text: "de l'annonce", emphasized: true },
            { text: " au dernier souvenir.", emphasized: false },
        ]);
    });

    it("leaves no empty part when the emphasis ends the heading", () => {
        expect(
            headingParts({ text: "Quatre moments, un seul lien.", emphasis: "un seul lien." }),
        ).toEqual([
            { text: "Quatre moments, ", emphasized: false },
            { text: "un seul lien.", emphasized: true },
        ]);
    });

    it("keeps the heading plain when the emphasis is missing or not found", () => {
        expect(headingParts({ text: "Tarifs" })).toEqual([{ text: "Tarifs", emphasized: false }]);
        expect(headingParts({ text: "Tarifs", emphasis: "Prix" })).toEqual([
            { text: "Tarifs", emphasized: false },
        ]);
    });
});
