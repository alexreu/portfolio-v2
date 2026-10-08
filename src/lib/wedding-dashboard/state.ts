import { z } from "zod";

import type { AnswerDraft } from "@/lib/wedding/answer";
import type { GuestQuestion } from "@/lib/wedding/types";

import {
    accessSummary,
    grantOf,
    isOpen,
    ofPerson,
    roleLabel,
    type AccessGrant,
    type Collaborator,
} from "./access";
import { weddingCalendar } from "./calendar";
import { dietSummary, householdStatus, householdSummary } from "./households";
import type { Fixture } from "./plan-selection";
import { ENTRANCE_HALF, fixtureInside, HEAD_HALF } from "./room";
import { DINNER } from "./seating";
import type {
    Activity,
    DateOverrides,
    DemoState,
    HouseholdRecord,
    InvitationDesign,
    MomentPlan,
    RoomFixture,
    RoomSize,
    SeatTable,
} from "./types";

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
    | { readonly type: "design-saved"; readonly design: InvitationDesign; readonly at: string }
    | {
          readonly type: "moment-saved";
          readonly moment: MomentPlan;
          /** For a new moment: invite every household already on the list. */
          readonly inviteAll: boolean;
          readonly at: string;
      }
    | { readonly type: "moment-removed"; readonly key: string; readonly at: string }
    | {
          readonly type: "questions-saved";
          readonly questions: readonly GuestQuestion[];
          readonly at: string;
      }
    | { readonly type: "table-saved"; readonly table: SeatTable }
    | {
          readonly type: "table-moved";
          readonly tableId: string;
          readonly x: number;
          readonly y: number;
      }
    | { readonly type: "tables-removed"; readonly tableIds: readonly string[] }
    | { readonly type: "guest-seated"; readonly guestId: string; readonly tableId: string | null }
    | { readonly type: "household-seated"; readonly householdId: string; readonly tableId: string }
    | {
          readonly type: "dates-saved";
          readonly day: string;
          readonly dates: DateOverrides;
          readonly at: string;
      }
    | { readonly type: "room-saved"; readonly name: string; readonly size: RoomSize }
    | {
          readonly type: "fixture-moved";
          readonly fixture: Fixture;
          readonly x: number;
          readonly y: number;
      }
    | { readonly type: "fixture-rotated"; readonly fixture: "head" | "entrance" }
    | {
          readonly type: "collaborator-invited";
          readonly collaborator: Collaborator;
          readonly at: string;
      }
    | { readonly type: "collaborator-joined"; readonly collaboratorId: string; readonly at: string }
    | {
          readonly type: "collaborator-updated";
          readonly collaboratorId: string;
          readonly role: string;
          readonly grant: AccessGrant;
          readonly at: string;
      }
    | {
          readonly type: "collaborator-reinvited";
          readonly collaboratorId: string;
          readonly at: string;
      }
    | {
          readonly type: "collaborator-removed";
          readonly collaboratorId: string;
          readonly at: string;
      };

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
                    detail: `${action.design.first} & ${action.design.second} · ${weddingCalendar(action.design.date, state.dates).dateLabel}`,
                    badge: "",
                },
            );
        case "dates-saved": {
            const calendar = weddingCalendar(action.day, action.dates);
            return withActivity(
                { ...state, design: { ...state.design, date: action.day }, dates: action.dates },
                {
                    at: action.at,
                    kind: "design",
                    text: "Dates du mariage mises à jour",
                    detail: `${calendar.dateLabel} · réponses avant le ${calendar.answerDeadlineLabel}`,
                    badge: "",
                },
            );
        }
        case "moment-saved":
            return momentSaved(state, action.moment, action.inviteAll, action.at);
        case "moment-removed":
            return momentRemoved(state, action.key, action.at);
        case "questions-saved":
            return withActivity(
                { ...state, questions: action.questions },
                {
                    at: action.at,
                    kind: "design",
                    text: "Questions du faire-part mises à jour",
                    detail: `${action.questions.length} ${action.questions.length > 1 ? "questions" : "question"}`,
                    badge: "",
                },
            );
        case "collaborator-invited":
        case "collaborator-joined":
        case "collaborator-updated":
        case "collaborator-reinvited":
        case "collaborator-removed":
            return access(state, action);
        default:
            return roomPlan(state, action);
    }
};

const accessEntry = (collaborator: Collaborator, at: string, text: string, detail: string) => ({
    at,
    kind: "access" as const,
    text,
    detail,
    badge: badgeFor(collaborator.firstName),
});

/** Who the couple let in, and what they may do: every change is kept in the activity. */
const access = (state: DemoState, action: DemoAction): DemoState => {
    if (action.type === "collaborator-invited") {
        const { collaborator, at } = action;
        return withActivity(
            { ...state, collaborators: [...state.collaborators, collaborator] },
            accessEntry(
                collaborator,
                at,
                `Invitation envoyée à ${collaborator.firstName}`,
                `${roleLabel(collaborator)} · valable 72 h`,
            ),
            collaborator.id,
        );
    }
    if (!("collaboratorId" in action)) return state;
    const collaborator = state.collaborators.find(
        (candidate) => candidate.id === action.collaboratorId,
    );
    if (!collaborator) return state;
    const { at } = action;
    const change = (next: Collaborator | null, text: string, detail: string) =>
        withActivity(
            {
                ...state,
                collaborators: state.collaborators.flatMap((candidate) => {
                    if (candidate.id !== collaborator.id) return [candidate];
                    return next ? [next] : [];
                }),
            },
            accessEntry(collaborator, at, text, detail),
            collaborator.id,
        );
    switch (action.type) {
        case "collaborator-joined":
            return change(
                { ...collaborator, joinedAt: at },
                `${collaborator.firstName} a rejoint votre tableau de bord`,
                roleLabel(collaborator),
            );
        case "collaborator-updated":
            if (!isOpen(action.grant)) return state;
            return change(
                { ...collaborator, role: action.role, grant: action.grant },
                `Accès ${ofPerson(collaborator.firstName)} modifiés`,
                accessSummary(action.grant),
            );
        case "collaborator-reinvited":
            return change(
                { ...collaborator, invitedAt: at },
                `Invitation renvoyée à ${collaborator.firstName}`,
                "valable 72 h",
            );
        case "collaborator-removed":
            return change(
                null,
                `Accès ${ofPerson(collaborator.firstName)} retiré`,
                "déconnexion de tous ses appareils",
            );
        default:
            return state;
    }
};

const momentSaved = (
    state: DemoState,
    moment: MomentPlan,
    inviteAll: boolean,
    at: string,
): DemoState => {
    const known = state.moments.some((candidate) => candidate.key === moment.key);
    const next: DemoState = {
        ...state,
        moments: known
            ? state.moments.map((candidate) => (candidate.key === moment.key ? moment : candidate))
            : [...state.moments, moment],
        households:
            known || !inviteAll
                ? state.households
                : state.households.map((household) => ({
                      ...household,
                      momentKeys: [...household.momentKeys, moment.key],
                  })),
    };
    return withActivity(next, {
        at,
        kind: "design",
        text: `${known ? "Moment modifié" : "Moment ajouté"} : ${moment.title}`,
        detail: `${moment.slots.length} ${moment.slots.length > 1 ? "horaires" : "horaire"}`,
        badge: "",
    });
};

const withoutKey = <Value>(record: Readonly<Record<string, Value>>, key: string) =>
    Object.fromEntries(Object.entries(record).filter(([candidate]) => candidate !== key));

const momentRemoved = (state: DemoState, key: string, at: string): DemoState => {
    const moment = state.moments.find((candidate) => candidate.key === key);
    if (!moment) return state;
    return withActivity(
        {
            ...state,
            moments: state.moments.filter((candidate) => candidate.key !== key),
            households: state.households.map((household) => ({
                ...household,
                momentKeys: household.momentKeys.filter((candidate) => candidate !== key),
                attendance: Object.fromEntries(
                    Object.entries(household.attendance).map(([guestId, answers]) => [
                        guestId,
                        withoutKey(answers, key),
                    ]),
                ),
            })),
        },
        {
            at,
            kind: "design",
            text: `Moment retiré : ${moment.title}`,
            detail: "retiré des invitations et des réponses",
            badge: "",
        },
    );
};

const clamp = (value: number) => Math.min(96, Math.max(4, Math.round(value)));

const seated = (state: DemoState, guestIds: readonly string[], tableId: string | null) => ({
    ...state,
    seats: {
        ...withoutKeys(state.seats, guestIds),
        ...(tableId ? Object.fromEntries(guestIds.map((guestId) => [guestId, tableId])) : {}),
    },
});

const withoutKeys = (record: Readonly<Record<string, string>>, keys: readonly string[]) =>
    Object.fromEntries(Object.entries(record).filter(([key]) => !keys.includes(key)));

/** A fixture moved or turned, kept along its wall without leaving the room. */
const placed = (state: DemoState, name: Fixture, fixture: RoomFixture): DemoState => ({
    ...state,
    room: {
        ...state.room,
        [name]: fixtureInside(state.room, fixture, name === "head" ? HEAD_HALF : ENTRANCE_HALF),
    },
});

/** Room plan changes are frequent and minor: they stay out of the activity feed. */
const roomPlan = (state: DemoState, action: DemoAction): DemoState => {
    switch (action.type) {
        case "table-saved":
            return {
                ...state,
                tables: state.tables.some((table) => table.id === action.table.id)
                    ? state.tables.map((table) =>
                          table.id === action.table.id ? action.table : table,
                      )
                    : [...state.tables, action.table],
            };
        case "table-moved":
            return {
                ...state,
                tables: state.tables.map((table) =>
                    table.id === action.tableId
                        ? { ...table, x: clamp(action.x), y: clamp(action.y) }
                        : table,
                ),
            };
        case "tables-removed":
            return {
                ...state,
                tables: state.tables.filter((table) => !action.tableIds.includes(table.id)),
                seats: Object.fromEntries(
                    Object.entries(state.seats).filter(
                        ([, tableId]) => !action.tableIds.includes(tableId),
                    ),
                ),
            };
        case "guest-seated":
            return seated(state, [action.guestId], action.tableId);
        case "household-seated": {
            const household = state.households.find(
                (candidate) => candidate.id === action.householdId,
            );
            const coming = (household?.guests ?? []).filter(
                (guest) => household?.attendance[guest.id]?.[DINNER] === "yes",
            );
            return seated(
                state,
                coming.map((guest) => guest.id),
                action.tableId,
            );
        }
        case "room-saved":
            return { ...state, room: { ...state.room, name: action.name, size: action.size } };
        case "fixture-moved":
            return placed(state, action.fixture, {
                ...state.room[action.fixture],
                x: clamp(action.x),
                y: clamp(action.y),
            });
        case "fixture-rotated": {
            const fixture = state.room[action.fixture];
            return placed(state, action.fixture, {
                ...fixture,
                rotation: fixture.rotation === 90 ? 0 : 90,
            });
        }
        default:
            return state;
    }
};

const presence = z.enum(["yes", "no"]);
const dietChoice = z.enum(["aucune", "vegetarien", "vegan", "sans-gluten", "autre"]);

/** Copies saved before fixtures could turn have no rotation: they stood facing the room. */
const fixtureSchema = z.object({
    x: z.number(),
    y: z.number(),
    rotation: z.union([z.literal(0), z.literal(90)]).default(0),
});

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
                "access",
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
    /** Absent from copies saved before the programme and room plan could be edited. */
    moments: z
        .array(
            z.object({
                key: z.string(),
                title: z.string(),
                slots: z.array(
                    z.object({
                        id: z.string(),
                        title: z.string(),
                        place: z.string(),
                        dayOffset: z.number(),
                        start: z.string(),
                        end: z.string(),
                    }),
                ),
            }),
        )
        .optional(),
    questions: z
        .array(z.object({ id: z.string(), label: z.string(), placeholder: z.string().optional() }))
        .optional(),
    tables: z
        .array(
            z.object({
                id: z.string(),
                number: z.number(),
                name: z.string(),
                capacity: z.number(),
                x: z.number(),
                y: z.number(),
            }),
        )
        .optional(),
    seats: z.record(z.string(), z.string()).optional(),
    room: z
        .object({
            name: z.string(),
            size: z.enum(["s", "m", "l", "xl"]),
            head: fixtureSchema,
            entrance: fixtureSchema,
        })
        .optional(),
    dates: z
        .object({
            answerDeadline: z.string().nullable(),
            reminder: z.string().nullable(),
            galleryOpens: z.string().nullable(),
        })
        .optional(),
    /** Absent from copies saved before the couple could share their dashboard. */
    collaborators: z
        .array(
            z.object({
                id: z.string(),
                firstName: z.string(),
                email: z.string(),
                role: z.string(),
                grant: z.record(z.string(), z.string()).transform(grantOf),
                invitedAt: z.string(),
                joinedAt: z.string().nullable(),
            }),
        )
        .optional(),
});

const defaultRoom = {
    name: "La salle",
    size: "s",
    head: { x: 50, y: 11, rotation: 0 },
    entrance: { x: 50, y: 91, rotation: 0 },
} as const;

type Editable = Pick<
    DemoState,
    "moments" | "questions" | "tables" | "seats" | "room" | "dates" | "collaborators"
>;

/** The browser copy may be stale, edited by hand or from an older demo: trusted only if valid. */
export const parseDemoState = (raw: string | null, defaults: () => Editable): DemoState | null => {
    if (raw === null) return null;
    try {
        const parsed = demoStateSchema.safeParse(JSON.parse(raw));
        if (!parsed.success) return null;
        const { moments, questions, tables, seats, room, dates, collaborators, ...rest } =
            parsed.data;
        const missing =
            !moments || !questions || !tables || !seats || !room || !dates || !collaborators
                ? defaults()
                : null;
        return {
            ...rest,
            moments: moments ?? missing?.moments ?? [],
            questions: questions ?? missing?.questions ?? [],
            tables: tables ?? missing?.tables ?? [],
            seats: seats ?? missing?.seats ?? {},
            room: room ?? missing?.room ?? defaultRoom,
            dates: dates ??
                missing?.dates ?? { answerDeadline: null, reminder: null, galleryOpens: null },
            collaborators: collaborators ?? missing?.collaborators ?? [],
        };
    } catch {
        return null;
    }
};
