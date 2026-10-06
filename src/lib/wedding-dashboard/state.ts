import { z } from "zod";

import type { AnswerDraft } from "@/lib/wedding/answer";

import { weddingCalendar } from "./calendar";
import { dietSummary, householdStatus, householdSummary } from "./households";
import type { Activity, DemoState, HouseholdRecord, InvitationDesign } from "./types";

export type DemoAction =
    | { readonly type: "household-added"; readonly household: HouseholdRecord; readonly at: string }
    | { readonly type: "household-opened"; readonly householdId: string; readonly at: string }
    | {
          readonly type: "answer-recorded";
          readonly householdId: string;
          readonly draft: AnswerDraft;
          readonly at: string;
          /** "maries": a paper answer the couple typed in. Defaults to the guest. */
          readonly by?: "invite" | "maries";
      }
    | { readonly type: "reminder-sent"; readonly at: string }
    | { readonly type: "photo-toggled"; readonly photoId: string; readonly at: string }
    | { readonly type: "design-saved"; readonly design: InvitationDesign; readonly at: string };

const ACTIVITY_KEPT = 30;
const HOUR = 3_600_000;

/** "MT" for Marie & Thomas, "FM" for Famille Moreau. */
export const badgeFor = (name: string) =>
    name
        .split(/\s+/)
        .filter((word) => /\p{L}/u.test(word))
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");

const withActivity = (
    state: DemoState,
    entry: Omit<Activity, "id" | "subject">,
    subject = "",
): DemoState => ({
    ...state,
    activity: [
        { ...entry, subject, id: `${entry.kind}-${entry.at}-${subject}` },
        ...state.activity,
    ].slice(0, ACTIVITY_KEPT),
});

const updateHousehold = (
    state: DemoState,
    householdId: string,
    change: (household: HouseholdRecord) => HouseholdRecord,
): DemoState => ({
    ...state,
    households: state.households.map((household) =>
        household.id === householdId ? change(household) : household,
    ),
});

/** Keeps only the household's own guests and moments, whatever the form sent. */
const answerOf = (household: HouseholdRecord, draft: AnswerDraft) => ({
    attendance: Object.fromEntries(
        household.guests.map((guest) => [
            guest.id,
            Object.fromEntries(
                household.momentKeys.flatMap((key) => {
                    const presence = draft.attendance[guest.id]?.[key];
                    return presence ? [[key, presence]] : [];
                }),
            ),
        ]),
    ),
    diets: Object.fromEntries(
        household.guests.flatMap((guest) => {
            const diet = draft.diets[guest.id];
            return diet ? [[guest.id, diet]] : [];
        }),
    ),
    questions: Object.fromEntries(
        Object.entries(draft.questions).flatMap(([id, answer]) =>
            answer.trim() ? [[id, answer.trim()]] : [],
        ),
    ),
    message: draft.message.trim(),
});

const answerDetail = (household: HouseholdRecord) => {
    const coming = household.guests.filter((guest) =>
        Object.values(household.attendance[guest.id] ?? {}).includes("yes"),
    ).length;
    const note = household.message ? ["un mot pour vous"] : [];
    if (coming === 0) return ["ne pourra pas venir", ...note].join(" · ");
    return [
        `${coming} ${coming > 1 ? "présents" : "présent"}`,
        ...dietSummary(household),
        ...note,
    ].join(" · ");
};

const opened = (state: DemoState, householdId: string, at: string): DemoState => {
    const household = state.households.find((candidate) => candidate.id === householdId);
    if (!household) return state;
    const next = updateHousehold(state, householdId, (current) => ({ ...current, lastSeenAt: at }));
    const recently =
        household.lastSeenAt !== null &&
        new Date(at).getTime() - new Date(household.lastSeenAt).getTime() < HOUR;
    return recently
        ? next
        : withActivity(
              next,
              {
                  at,
                  kind: "opened",
                  text: `${household.name} a ouvert son lien`,
                  detail: household.answeredAt ? "réponse déjà envoyée" : "pas encore de réponse",
                  badge: badgeFor(household.name),
              },
              householdId,
          );
};

const answeredText = (state: DemoState, household: HouseholdRecord, by: "invite" | "maries") => {
    if (by === "maries") return `Réponse de ${household.name} saisie par ${state.design.first}`;
    return household.answeredAt
        ? `${household.name} a modifié sa réponse`
        : `${household.name} a répondu`;
};

const answered = (
    state: DemoState,
    householdId: string,
    draft: AnswerDraft,
    at: string,
    by: "invite" | "maries",
): DemoState => {
    const household = state.households.find((candidate) => candidate.id === householdId);
    if (!household) return state;
    const updated: HouseholdRecord = {
        ...household,
        ...answerOf(household, draft),
        answeredAt: at,
        answeredBy: by,
        lastSeenAt: by === "invite" ? at : household.lastSeenAt,
    };
    return withActivity(
        updateHousehold(state, householdId, () => updated),
        {
            at,
            kind: household.answeredAt ? "updated" : "answered",
            text: answeredText(state, household, by),
            detail: answerDetail(updated),
            badge: badgeFor(household.name),
        },
        householdId,
    );
};

const reminded = (state: DemoState, at: string): DemoState => {
    const count = state.households.filter(
        (household) => householdStatus(household) !== "answered",
    ).length;
    return withActivity(
        { ...state, lastReminder: { at, count } },
        {
            at,
            kind: "reminded",
            text: `Relance envoyée à ${count} ${count > 1 ? "foyers" : "foyer"}`,
            detail: "seulement à ceux qui n'ont pas encore répondu",
            badge: "",
        },
    );
};

const photoToggled = (state: DemoState, photoId: string, at: string): DemoState => {
    const photo = state.photos.find((candidate) => candidate.id === photoId);
    if (!photo) return state;
    return withActivity(
        {
            ...state,
            photos: state.photos.map((candidate) =>
                candidate.id === photoId
                    ? { ...candidate, removed: !candidate.removed }
                    : candidate,
            ),
        },
        {
            at,
            kind: "photo",
            text: photo.removed
                ? `Photo de ${photo.author} remise dans la galerie`
                : `Photo de ${photo.author} retirée de la galerie`,
            detail: photo.removed
                ? "de nouveau visible par les invités"
                : "les invités ne la voient plus",
            badge: "",
        },
        photoId,
    );
};

export const demoReducer = (state: DemoState, action: DemoAction): DemoState => {
    switch (action.type) {
        case "household-added":
            return withActivity(
                { ...state, households: [action.household, ...state.households] },
                {
                    at: action.at,
                    kind: "created",
                    text: `Faire-part créé pour ${action.household.name}`,
                    detail: `${householdSummary(action.household)} · lien personnel prêt`,
                    badge: badgeFor(action.household.name),
                },
                action.household.id,
            );
        case "household-opened":
            return opened(state, action.householdId, action.at);
        case "answer-recorded":
            return answered(
                state,
                action.householdId,
                action.draft,
                action.at,
                action.by ?? "invite",
            );
        case "reminder-sent":
            return reminded(state, action.at);
        case "photo-toggled":
            return photoToggled(state, action.photoId, action.at);
        case "design-saved":
            return withActivity(
                { ...state, design: action.design },
                {
                    at: action.at,
                    kind: "design",
                    text: "Faire-part mis à jour",
                    detail: `${action.design.first} & ${action.design.second} · ${weddingCalendar(action.design.date).dateLabel}`,
                    badge: "",
                },
            );
    }
};

const presence = z.enum(["yes", "no"]);
const dietChoice = z.enum(["aucune", "vegetarien", "vegan", "sans-gluten", "autre"]);

const demoStateSchema = z.object({
    version: z.literal(1),
    design: z.object({
        first: z.string(),
        second: z.string(),
        date: z.string(),
        place: z.string(),
        welcome: z.string(),
        tone: z.enum(["olive", "terre", "encre"]),
    }),
    households: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            group: z.enum(["famille-1", "famille-2", "amis", "collegues"]),
            email: z.string(),
            guests: z.array(
                z.object({
                    id: z.string(),
                    firstName: z.string(),
                    child: z.boolean(),
                    labels: z.object({ yes: z.string(), no: z.string() }).optional(),
                }),
            ),
            momentKeys: z.array(z.string()),
            lastSeenAt: z.string().nullable(),
            attendance: z.record(z.string(), z.record(z.string(), presence)),
            diets: z.record(z.string(), z.object({ choice: dietChoice, other: z.string() })),
            answeredAt: z.string().nullable(),
            answeredBy: z.enum(["invite", "maries"]).nullable(),
            createdAt: z.string(),
            /** Absent from copies saved before notes and questions were kept. */
            questions: z.record(z.string(), z.string()).default({}),
            message: z.string().default(""),
        }),
    ),
    activity: z.array(
        z.object({
            id: z.string(),
            at: z.string(),
            kind: z.enum([
                "answered",
                "updated",
                "opened",
                "created",
                "reminded",
                "design",
                "photo",
            ]),
            text: z.string(),
            detail: z.string(),
            badge: z.string(),
            subject: z.string().default(""),
        }),
    ),
    photos: z.array(
        z.object({
            id: z.string(),
            src: z.string(),
            alt: z.string(),
            author: z.string(),
            removed: z.boolean(),
        }),
    ),
    lastReminder: z.object({ at: z.string(), count: z.number() }).nullable(),
});

/** The browser copy may be stale, edited by hand or from an older demo: trusted only if valid. */
export const parseDemoState = (raw: string | null): DemoState | null => {
    if (raw === null) return null;
    try {
        const parsed = demoStateSchema.safeParse(JSON.parse(raw));
        return parsed.success ? parsed.data : null;
    } catch {
        return null;
    }
};
