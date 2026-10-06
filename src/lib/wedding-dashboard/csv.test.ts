import { describe, expect, it } from "vitest";

import { guestListCsv } from "./csv";
import type { HouseholdRecord } from "./types";

const moreau: HouseholdRecord = {
    id: "moreau",
    name: "Famille Moreau",
    group: "famille-2",
    email: "",
    guests: [
        { id: "claire", firstName: "Claire", child: false },
        { id: "leo", firstName: "Léo", child: true },
    ],
    momentKeys: ["ceremonie", "diner"],
    lastSeenAt: "2026-10-01T10:00:00+02:00",
    attendance: {
        claire: { ceremonie: "yes", diner: "yes" },
        leo: { ceremonie: "yes", diner: "no" },
    },
    diets: { claire: { choice: "autre", other: 'sans lactose; "strict"' } },
    answeredAt: "2026-10-01T10:05:00+02:00",
    answeredBy: "invite",
    createdAt: "2026-09-01T10:00:00+02:00",
    questions: {},
    message: "",
};

const moments = [
    { key: "ceremonie", title: "Cérémonie", slots: [] },
    { key: "diner", title: "Dîner", slots: [] },
    { key: "brunch", title: "Brunch", slots: [] },
];

const csv = (households: readonly HouseholdRecord[]) =>
    guestListCsv(households, moments, () => "Famille Hugo");

describe("guestListCsv", () => {
    it("writes one line per guest, in the semicolon format French spreadsheets open", () => {
        const lines = csv([moreau]).replace("﻿", "").split("\r\n");

        expect(lines).toEqual([
            "Foyer;Groupe;Prénom;Enfant;Cérémonie;Dîner;Brunch;Régime;Précision",
            'Famille Moreau;Famille Hugo;Claire;Non;Oui;Oui;Non invité;Autre;"sans lactose; ""strict"""',
            "Famille Moreau;Famille Hugo;Léo;Oui;Oui;Non;Non invité;Aucun;",
        ]);
    });

    it("starts with a byte order mark so accents survive Excel", () => {
        expect(csv([moreau]).startsWith("﻿")).toBe(true);
    });

    it("leaves waiting answers visible", () => {
        const waiting = { ...moreau, attendance: {}, answeredAt: null, answeredBy: null };
        expect(csv([waiting]).split("\r\n")[1]).toContain(";En attente;En attente;");
    });

    it("never lets a typed name run as a spreadsheet formula", () => {
        const formula = { ...moreau, name: '=HYPERLINK("http://x")' };
        expect(csv([formula]).split("\r\n")[1].startsWith("\"'=HYPERLINK(")).toBe(true);
    });
});
