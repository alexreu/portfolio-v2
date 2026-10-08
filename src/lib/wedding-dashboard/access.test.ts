import { describe, expect, it } from "vitest";

import {
    ACCESS_FEATURES,
    accessSummary,
    collaboratorStatus,
    createCollaborator,
    expiryLabel,
    grantOf,
    noGrant,
    templateGrant,
    templateOf,
    validateCollaboratorDraft,
    withLevel,
    type CollaboratorDraft,
} from "./access";

const draft: CollaboratorDraft = {
    firstName: " Inès ",
    email: " Ines.Roux@Exemple.fr ",
    role: " Témoin de Camille ",
    grant: templateGrant("temoin"),
};

describe("templateGrant", () => {
    it("lets a witness read the guest list, without diets, and run the seating plan and gallery", () => {
        const grant = templateGrant("temoin");
        expect(grant.invites).toBe("lecture");
        expect(grant["invites.regimes"]).toBe("aucun");
        expect(grant["plan-de-table"]).toBe("modification");
        expect(grant.galerie).toBe("modification");
        expect(grant.relances).toBe("aucun");
    });

    it("gives a wedding planner every function at its highest level", () => {
        const grant = templateGrant("planner");
        ACCESS_FEATURES.forEach((feature) =>
            expect(grant[feature.key]).toBe(feature.levels[feature.levels.length - 1]),
        );
        expect(grant["invites.regimes"]).toBe("lecture");
    });
});

describe("templateOf", () => {
    it("recognises the templates, and anything else as made to measure", () => {
        expect(templateOf(templateGrant("temoin"))).toBe("temoin");
        expect(templateOf(templateGrant("planner"))).toBe("planner");
        expect(templateOf(withLevel(templateGrant("temoin"), "relances", "lecture"))).toBe(
            "sur-mesure",
        );
    });
});

describe("withLevel", () => {
    it("changes one function only", () => {
        const grant = withLevel(noGrant, "programme", "lecture");
        expect(grant.programme).toBe("lecture");
        expect(grant.dates).toBe("aucun");
    });

    it("keeps a function to the levels it offers", () => {
        expect(withLevel(templateGrant("planner"), "invites.regimes", "modification")).toEqual(
            templateGrant("planner"),
        );
    });

    it("hides diets and export along with the guest list", () => {
        const grant = withLevel(templateGrant("planner"), "invites", "aucun");
        expect(grant["invites.regimes"]).toBe("aucun");
        expect(grant["invites.export"]).toBe("aucun");
    });

    it("refuses diets or export while the guest list is hidden", () => {
        expect(withLevel(noGrant, "invites.regimes", "lecture")).toEqual(noGrant);
    });
});

describe("grantOf", () => {
    it("fills what a stored copy leaves out and drops what it may not hold", () => {
        expect(
            grantOf({ invites: "lecture", "invites.regimes": "modification", inconnu: "lecture" }),
        ).toEqual({ ...noGrant, invites: "lecture" });
    });
});

describe("accessSummary", () => {
    it("says what the person edits, then what they only read", () => {
        expect(accessSummary(templateGrant("temoin"))).toBe(
            "Modifie : plan de table, galerie · Voit : invités",
        );
    });

    it("says it in a word when everything is open", () => {
        expect(accessSummary(templateGrant("planner"))).toBe("Tout voir, tout modifier");
    });

    it("says when nothing is open", () => {
        expect(accessSummary(noGrant)).toBe("Aucun accès");
    });
});

describe("collaboratorStatus", () => {
    const now = new Date("2026-10-07T12:00:00Z");
    const invited = createCollaborator(
        { firstName: "Sophie", email: "sophie@exemple.fr", role: "", grant: noGrant },
        { id: "sophie", at: "2026-10-06T12:00:00Z" },
    );

    it("waits for an invitation less than 72 hours old", () => {
        expect(collaboratorStatus(invited, now)).toEqual({
            kind: "pending",
            expiresAt: "2026-10-09T12:00:00.000Z",
        });
    });

    it("lets an unopened invitation expire after 72 hours", () => {
        expect(collaboratorStatus(invited, new Date("2026-10-09T12:00:01Z"))).toEqual({
            kind: "expired",
        });
    });

    it("counts someone who joined as active, whatever the invitation's age", () => {
        const joined = { ...invited, joinedAt: "2026-10-06T13:00:00Z" };
        expect(collaboratorStatus(joined, new Date("2026-12-01T00:00:00Z"))).toEqual({
            kind: "active",
            since: "2026-10-06T13:00:00Z",
        });
    });
});

describe("validateCollaboratorDraft", () => {
    it("trims the fields and keeps the address in lower case", () => {
        const result = validateCollaboratorDraft(draft, []);
        expect(result).toEqual({
            ok: true,
            value: {
                firstName: "Inès",
                email: "ines.roux@exemple.fr",
                role: "Témoin de Camille",
                grant: draft.grant,
            },
        });
    });

    it("asks for a first name, a valid address and at least one function", () => {
        const result = validateCollaboratorDraft(
            { firstName: "", email: "ines@", role: "", grant: noGrant },
            [],
        );
        expect(result).toEqual({
            ok: false,
            error: [
                { path: "firstName", code: "required" },
                { path: "email", code: "email-invalid" },
                { path: "grant", code: "access-required" },
            ],
        });
    });

    it("requires the address, as the invitation is tied to it", () => {
        const result = validateCollaboratorDraft({ ...draft, email: " " }, []);
        expect(result.ok || result.error).toEqual([{ path: "email", code: "required" }]);
    });

    it("refuses an address that already has access, whatever its case", () => {
        const result = validateCollaboratorDraft(draft, ["ines.roux@exemple.fr"]);
        expect(result.ok || result.error).toEqual([{ path: "email", code: "email-taken" }]);
    });

    it("refuses a role too long to read in the list", () => {
        const result = validateCollaboratorDraft({ ...draft, role: "x".repeat(41) }, []);
        expect(result.ok || result.error).toEqual([{ path: "role", code: "too-long" }]);
    });
});

describe("createCollaborator", () => {
    it("starts as a pending invitation", () => {
        expect(
            createCollaborator(
                { firstName: "Inès", email: "ines@exemple.fr", role: "", grant: noGrant },
                { id: "ines-x7", at: "2026-10-07T10:00:00Z" },
            ),
        ).toEqual({
            id: "ines-x7",
            firstName: "Inès",
            email: "ines@exemple.fr",
            role: "",
            grant: noGrant,
            invitedAt: "2026-10-07T10:00:00Z",
            joinedAt: null,
        });
    });
});

describe("expiryLabel", () => {
    const now = new Date("2026-10-07T12:00:00Z");

    it("counts in days, then in hours on the last day", () => {
        expect(expiryLabel("2026-10-09T20:00:00Z", now)).toBe("expire dans 2 j");
        expect(expiryLabel("2026-10-08T05:30:00Z", now)).toBe("expire dans 17 h");
        expect(expiryLabel("2026-10-07T12:20:00Z", now)).toBe("expire dans moins d'1 h");
    });
});
