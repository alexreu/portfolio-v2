import { templateGrant, type Collaborator } from "@/lib/wedding-dashboard/access";
import { plansFromMoments } from "@/lib/wedding-dashboard/programme-plan";
import { demoReducer, type DemoAction } from "@/lib/wedding-dashboard/state";
import type {
    DemoState,
    GroupKey,
    GuestRecord,
    HouseholdRecord,
    InvitationDesign,
    SeatTable,
} from "@/lib/wedding-dashboard/types";
import type { DietChoice, Presence } from "@/lib/wedding/answer";

import { weddingDemo } from "./wedding-demo";

/** The seed replays only events that happened at a given time. */
type TimedAction = Extract<DemoAction, { readonly at: string }>;

/** Marie & Thomas: the household visitors play on the guest site. */
export const DEMO_GUEST_HOUSEHOLD = "lefevre";

/** The day the demo content is written for; another date moves the whole programme. */
export const CONTENT_WEDDING_DAY = "2027-06-12";

export const DEMO_STORAGE_KEY = "alexdevlab:mariage-demo:v1";

export const defaultDesign: InvitationDesign = {
    first: weddingDemo.couple.first,
    second: weddingDemo.couple.second,
    date: CONTENT_WEDDING_DAY,
    place: "Luberon",
    welcome:
        "Chers {invités}, nous nous marions et nous aimerions beaucoup que vous soyez là, pour la cérémonie et pour le dîner.",
    tone: "olive",
};

const C = "ceremonie-vin-honneur";
const D = "diner";
const B = "brunch";
const ALL = [C, D, B];

type Ago = { readonly days?: number; readonly hours?: number; readonly minutes?: number };

type GuestPlan =
    | string
    | {
          readonly firstName: string;
          readonly child?: boolean;
          readonly labels?: GuestRecord["labels"];
      };

type HouseholdPlan = {
    readonly id: string;
    readonly name: string;
    readonly group: GroupKey;
    readonly guests: readonly GuestPlan[];
    readonly moments: readonly string[];
    readonly seen?: Ago;
    readonly answer?: {
        readonly at: Ago;
        readonly by?: "maries";
        /** The household's answer, moment by moment; `except` changes it for one guest. */
        readonly moments: Readonly<Record<string, Presence>>;
        readonly except?: Readonly<Record<string, Readonly<Record<string, Presence>>>>;
        /** By first name: a known diet, or the free text of an « autre » one. */
        readonly diets?: Readonly<Record<string, DietChoice | { readonly other: string }>>;
        /** Answer to « Une chanson qui vous fera danser ». */
        readonly song?: string;
        readonly message?: string;
    };
};

const yesAll = { [C]: "yes", [D]: "yes", [B]: "yes" } as const;

const plans: readonly HouseholdPlan[] = [
    {
        id: DEMO_GUEST_HOUSEHOLD,
        name: weddingDemo.household.name,
        group: "amis",
        guests: weddingDemo.household.invitation.guests.map((guest) => ({
            firstName: guest.firstName,
            labels: (
                weddingDemo.household.presenceLabels as Readonly<
                    Record<string, GuestRecord["labels"]>
                >
            )[guest.id],
        })),
        moments: weddingDemo.household.invitation.momentKeys,
        seen: { days: 1, hours: 3 },
    },
    {
        id: "moreau",
        name: "Famille Moreau",
        group: "famille-2",
        guests: [
            "Claire",
            "Antoine",
            { firstName: "Léo", child: true },
            { firstName: "Jade", child: true },
        ],
        moments: ALL,
        answer: {
            at: { days: 1, hours: 6 },
            moments: yesAll,
            diets: { Jade: "sans-gluten" },
            song: "ABBA — Dancing Queen",
            message:
                "On a hâte de danser avec vous ! Léo et Jade demandent s'il y aura un gâteau à étages.",
        },
    },
    {
        id: "bertrand",
        name: "Julien Bertrand",
        group: "collegues",
        guests: ["Julien"],
        moments: [C, D],
        answer: {
            at: { days: 3, hours: 2 },
            moments: { [C]: "no", [D]: "no" },
            message:
                "Désolé de rater ça, je serai à Montréal pour le travail. Je vous embrasse fort.",
        },
    },
    {
        id: "haddad",
        name: "Inès & Karim",
        group: "amis",
        guests: [
            { firstName: "Inès", labels: { yes: "Présente", no: "Absente" } },
            { firstName: "Karim", labels: { yes: "Présent", no: "Absent" } },
        ],
        moments: ALL,
        seen: { days: 6, hours: 4 },
    },
    {
        id: "durand",
        name: "Mamie Jeanne",
        group: "famille-1",
        guests: [{ firstName: "Jeanne", labels: { yes: "Présente", no: "Absente" } }],
        moments: [C, D],
        answer: {
            at: { days: 10, hours: 1 },
            by: "maries",
            moments: { [C]: "yes", [D]: "yes" },
            diets: { Jeanne: "sans-gluten" },
            message: "Au téléphone : « J'apporte mon châle, et je danserai au moins une valse. »",
        },
    },
    {
        id: "petit",
        name: "Lucas & Emma Petit",
        group: "famille-2",
        guests: ["Lucas", "Emma"],
        moments: ALL,
    },
    {
        id: "garcia",
        name: "Sofia Garcia",
        group: "amis",
        guests: [{ firstName: "Sofia", labels: { yes: "Présente", no: "Absente" } }],
        moments: ALL,
        answer: {
            at: { hours: 2, minutes: 18 },
            moments: yesAll,
            diets: { Sofia: "vegetarien" },
            song: "Daft Punk — One More Time",
            message: "Je viens avec mes plus belles chaussures (plates, promis, pour la pelouse).",
        },
    },
    {
        id: "martin",
        name: "Famille Martin",
        group: "famille-1",
        guests: ["Paul", "Hélène", { firstName: "Zoé", child: true }],
        moments: ALL,
        answer: {
            at: { days: 5, hours: 3 },
            moments: { [C]: "yes", [D]: "yes", [B]: "no" },
            diets: { Hélène: "vegan" },
            message: "Félicitations à vous deux, on repart tôt dimanche pour l'école.",
        },
    },
    {
        id: "roux",
        name: "Nathalie & Éric Roux",
        group: "famille-1",
        guests: ["Nathalie", "Éric"],
        moments: [C, D],
        seen: { days: 2, hours: 5 },
    },
    {
        id: "lambert",
        name: "Chloé Lambert",
        group: "collegues",
        guests: [{ firstName: "Chloé", labels: { yes: "Présente", no: "Absente" } }],
        moments: [C],
        answer: { at: { days: 4, hours: 7 }, moments: { [C]: "yes" } },
    },
    {
        id: "fontaine",
        name: "Antoine & Sarah Fontaine",
        group: "amis",
        guests: ["Antoine", "Sarah"],
        moments: ALL,
        answer: {
            at: { days: 7, hours: 2 },
            moments: yesAll,
            diets: { Sarah: "vegetarien" },
            song: "Elvis Presley — Jailhouse Rock",
            message: "On réserve la piste pour le rock, prévenez l'orchestre !",
        },
    },
    {
        id: "girard",
        name: "Michel & Anne Girard",
        group: "famille-2",
        guests: ["Michel", "Anne"],
        moments: ALL,
        answer: { at: { days: 8, hours: 1 }, moments: { [C]: "yes", [D]: "yes", [B]: "no" } },
    },
    {
        id: "bonnet",
        name: "Hélène Bonnet",
        group: "famille-1",
        guests: ["Hélène"],
        moments: [C, D],
    },
    {
        id: "dupont",
        name: "Maxime & Julie Dupont",
        group: "amis",
        guests: ["Maxime", "Julie"],
        moments: ALL,
        answer: {
            at: { days: 2, hours: 1 },
            moments: yesAll,
            diets: { Maxime: { other: "allergie aux arachides" } },
            song: "Stromae — Alors on danse",
        },
    },
    {
        id: "mercier",
        name: "Famille Mercier",
        group: "famille-2",
        guests: [
            "Stéphane",
            "Laure",
            { firstName: "Tom", child: true },
            { firstName: "Lina", child: true },
        ],
        moments: [C, D],
        answer: {
            at: { days: 12, hours: 4 },
            moments: { [C]: "yes", [D]: "yes" },
            diets: { Laure: "sans-gluten" },
        },
    },
    {
        id: "blanc",
        name: "Pierre Blanc",
        group: "collegues",
        guests: ["Pierre"],
        moments: [C],
        seen: { days: 3, hours: 6 },
    },
    {
        id: "faure",
        name: "Léa & Nicolas Faure",
        group: "amis",
        guests: ["Léa", "Nicolas"],
        moments: ALL,
        answer: {
            at: { hours: 3, minutes: 40 },
            moments: yesAll,
            song: "Whitney Houston — I Wanna Dance with Somebody",
            message: "Préparez les mouchoirs : le discours des témoins est (presque) prêt.",
        },
    },
    {
        id: "chevalier",
        name: "Mathilde Chevalier",
        group: "amis",
        guests: ["Mathilde"],
        moments: ALL,
    },
    {
        id: "robin",
        name: "Papi André",
        group: "famille-2",
        guests: ["André"],
        moments: [C, D],
        answer: { at: { days: 15 }, by: "maries", moments: { [C]: "yes", [D]: "no" } },
    },
    {
        id: "morel",
        name: "Yanis & Clara Morel",
        group: "collegues",
        guests: ["Yanis", "Clara"],
        moments: [C, D],
        answer: {
            at: { days: 6, hours: 2 },
            moments: { [C]: "no", [D]: "no" },
            message: "Une pensée pour vous ce jour-là, belle fête à tous les deux !",
        },
    },
    {
        id: "perrin",
        name: "Famille Perrin",
        group: "famille-1",
        guests: ["Olivier", "Isabelle", { firstName: "Noé", child: true }],
        moments: ALL,
        seen: { days: 9, hours: 2 },
    },
    {
        id: "caron",
        name: "Emma Caron",
        group: "amis",
        guests: [{ firstName: "Emma", labels: { yes: "Présente", no: "Absente" } }],
        moments: ALL,
        answer: {
            at: { hours: 20 },
            moments: { [C]: "yes", [D]: "yes", [B]: "no" },
            diets: { Emma: "vegetarien" },
            song: "Beyoncé — Crazy in Love",
        },
    },
];

/** The orangery's round tables, named after Provence; table 7 is Marie & Thomas's. */
const tables: readonly SeatTable[] = [
    { id: "t1", number: 1, name: "Les Lavandes", capacity: 8, x: 16, y: 37 },
    { id: "t2", number: 2, name: "Les Cyprès", capacity: 8, x: 36, y: 37 },
    { id: "t3", number: 3, name: "Les Amandiers", capacity: 8, x: 64, y: 37 },
    { id: "t4", number: 4, name: "Les Figuiers", capacity: 8, x: 84, y: 37 },
    { id: "t5", number: 5, name: "Les Platanes", capacity: 8, x: 16, y: 69 },
    { id: "t6", number: 6, name: "Les Vignes", capacity: 8, x: 36, y: 69 },
    { id: "t7", number: 7, name: "Les Oliviers", capacity: 8, x: 64, y: 69 },
    { id: "t8", number: 8, name: "Les Mûriers", capacity: 8, x: 84, y: 69 },
];

/** Who sits where so far: the Mercier family still waits for a table. */
const seating: Readonly<Record<string, string>> = {
    [DEMO_GUEST_HOUSEHOLD]: "t7",
    moreau: "t1",
    martin: "t1",
    garcia: "t2",
    caron: "t2",
    faure: "t2",
    durand: "t3",
    girard: "t3",
    fontaine: "t4",
    dupont: "t4",
};

const ago = (now: Date, { days = 0, hours = 0, minutes = 0 }: Ago) =>
    new Date(now.getTime() - ((days * 24 + hours) * 60 + minutes) * 60_000).toISOString();

type CollaboratorPlan = Omit<Collaborator, "invitedAt" | "joinedAt"> & {
    readonly invited: Ago;
    readonly joined?: Ago;
};

/**
 * Who shares the dashboard: Camille's witness came in long ago, Hugo's never opened his
 * invitation, and the planner's is still waiting.
 */
const collaborators: readonly CollaboratorPlan[] = [
    {
        id: "elsa",
        firstName: "Elsa",
        email: "elsa.marchand@exemple.fr",
        role: "Témoin de Camille",
        grant: templateGrant("temoin"),
        invited: { days: 24 },
        joined: { days: 23, hours: 20 },
    },
    {
        id: "malik",
        firstName: "Malik",
        email: "malik.benali@exemple.fr",
        role: "Témoin de Hugo",
        grant: { ...templateGrant("temoin"), relances: "lecture" },
        invited: { days: 5 },
    },
    {
        id: "agathe",
        firstName: "Agathe",
        email: "agathe@atelier-agathe.exemple.fr",
        role: "Wedding planner",
        grant: templateGrant("planner"),
        invited: { hours: 20 },
    },
];

const collaboratorActions = (plan: CollaboratorPlan, now: Date): readonly TimedAction[] => {
    const { invited, joined, ...collaborator } = plan;
    const at = ago(now, invited);
    return [
        {
            type: "collaborator-invited",
            collaborator: { ...collaborator, invitedAt: at, joinedAt: null },
            at,
        },
        ...(joined
            ? [
                  {
                      type: "collaborator-joined" as const,
                      collaboratorId: plan.id,
                      at: ago(now, joined),
                  },
              ]
            : []),
    ];
};

const guestId = (householdId: string, firstName: string) =>
    `${householdId}-${firstName
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()}`;

const guestOf = (householdId: string, plan: GuestPlan): GuestRecord =>
    typeof plan === "string"
        ? { id: guestId(householdId, plan), firstName: plan, child: false }
        : { child: false, ...plan, id: guestId(householdId, plan.firstName) };

/** Everyone received their faire-part the same morning, a month ago. */
const invited = (plan: HouseholdPlan, now: Date): HouseholdRecord => ({
    id: plan.id,
    name: plan.name,
    group: plan.group,
    email: "",
    guests: plan.guests.map((guest) => guestOf(plan.id, guest)),
    momentKeys: plan.moments,
    lastSeenAt: null,
    attendance: {},
    diets: {},
    answeredAt: null,
    answeredBy: null,
    createdAt: ago(now, { days: 30 }),
    questions: {},
    message: "",
});

const answerAction = (
    plan: HouseholdPlan,
    household: HouseholdRecord,
    now: Date,
): readonly TimedAction[] => {
    if (!plan.answer) return [];
    const { at, by, moments, except = {}, diets = {}, song, message = "" } = plan.answer;
    return [
        {
            type: "answer-recorded",
            householdId: household.id,
            at: ago(now, at),
            by: by ?? "invite",
            draft: {
                attendance: Object.fromEntries(
                    household.guests.map((guest) => [
                        guest.id,
                        { ...moments, ...except[guest.firstName] },
                    ]),
                ),
                diets: Object.fromEntries(
                    household.guests.flatMap((guest) => {
                        const diet = diets[guest.firstName];
                        if (!diet) return [];
                        return [
                            [
                                guest.id,
                                typeof diet === "string"
                                    ? { choice: diet, other: "" }
                                    : { choice: "autre" as const, other: diet.other },
                            ],
                        ];
                    }),
                ),
                consent: Object.keys(diets).length > 0,
                questions: song ? { chanson: song } : {},
                message,
            },
        },
    ];
};

/**
 * The guest list as the couple finds it, a month after sending the faire-parts. The activity
 * feed is replayed through the reducer, so it always reads like the dashboard writes it.
 */
export const demoSeed = (now: Date): DemoState => {
    const households = plans.map((plan) => invited(plan, now));
    const actions: readonly TimedAction[] = [
        ...plans.flatMap((plan, index): readonly TimedAction[] =>
            plan.seen
                ? [{ type: "household-opened", householdId: plan.id, at: ago(now, plan.seen) }]
                : answerAction(plan, households[index], now),
        ),
        { type: "reminder-sent", at: ago(now, { days: 9, hours: 5 }) },
        ...collaborators.flatMap((plan) => collaboratorActions(plan, now)),
    ];
    const start: DemoState = {
        version: 1,
        design: defaultDesign,
        households,
        activity: [],
        photos: weddingDemo.gallery.photos.map((photo, index) => ({
            id: `photo-${index + 1}`,
            src: photo.src,
            alt: photo.alt,
            author: photo.author,
            removed: false,
        })),
        lastReminder: null,
        moments: plansFromMoments(weddingDemo.moments, CONTENT_WEDDING_DAY),
        questions: weddingDemo.questions,
        tables,
        dates: { answerDeadline: null, reminder: null, galleryOpens: null },
        room: {
            name: "L'orangerie",
            size: "s",
            revealAt: "10:00",
            head: { x: 50, y: 11, rotation: 0 },
            entrance: { x: 50, y: 91, rotation: 0 },
        },
        collaborators: [],
        seats: Object.fromEntries(
            households.flatMap((household) =>
                seating[household.id]
                    ? household.guests.map((guest) => [guest.id, seating[household.id]])
                    : [],
            ),
        ),
    };
    return [...actions].sort((a, b) => a.at.localeCompare(b.at)).reduce(demoReducer, start);
};
