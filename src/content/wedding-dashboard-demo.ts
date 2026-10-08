import {
    FLAGS,
    plansFromMoments,
    runCommand,
    type Actor,
    type Collaborator,
    type Command,
    type DietChoice,
    type GuestRecord,
    type HouseholdGroup,
    type HouseholdRecord,
    type InvitationDesign,
    type Presence,
    type SeatTable,
    type WeddingState,
} from "@alexreu/wedding-core";

import { weddingDemo } from "./wedding-demo";

/** One event of the seed: a command, who sent it, and when. */
type TimedCommand = {
    readonly command: Command;
    readonly actor: Actor;
    readonly at: string;
    /** The id the command gives what it creates: a person the couple invited. */
    readonly id?: string;
};

/** Marie & Thomas: the household visitors play on the guest site. */
export const DEMO_GUEST_HOUSEHOLD = "lefevre";

/** The day the demo content is written for; another date moves the whole programme. */
export const CONTENT_WEDDING_DAY = "2027-06-12";

/** v3: the wedding-core 0.3 state, with the wedding's settings. */
export const DEMO_STORAGE_KEY = "alexdevlab:mariage-demo:v3";

export const defaultDesign: InvitationDesign = {
    first: weddingDemo.couple.first,
    second: weddingDemo.couple.second,
    date: CONTENT_WEDDING_DAY,
    place: "Luberon",
    welcome:
        "Chers {invités}, nous nous marions et nous aimerions beaucoup que vous soyez là, pour la cérémonie et pour le dîner.",
    tone: "olive",
};

/** The couple's groups: families named after each of them, friends, colleagues. */
const groups: readonly HouseholdGroup[] = [
    { id: "family-1", label: `Famille ${weddingDemo.couple.first}` },
    { id: "family-2", label: `Famille ${weddingDemo.couple.second}` },
    { id: "friends", label: "Amis" },
    { id: "colleagues", label: "Collègues" },
];

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
    readonly group: string;
    /** Where the household's personal link is sent; some families only got the paper one. */
    readonly email?: string;
    readonly guests: readonly GuestPlan[];
    readonly moments: readonly string[];
    readonly seen?: Ago;
    readonly answer?: {
        readonly at: Ago;
        readonly by?: "couple";
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
        email: "marie.lefevre@exemple.fr",
        name: weddingDemo.household.name,
        group: "friends",
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
        email: "claire.moreau@exemple.fr",
        name: "Famille Moreau",
        group: "family-2",
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
            diets: { Jade: "gluten-free" },
            song: "ABBA — Dancing Queen",
            message:
                "On a hâte de danser avec vous ! Léo et Jade demandent s'il y aura un gâteau à étages.",
        },
    },
    {
        id: "bertrand",
        email: "julien.bertrand@exemple.fr",
        name: "Julien Bertrand",
        group: "colleagues",
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
        email: "ines.haddad@exemple.fr",
        name: "Inès & Karim",
        group: "friends",
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
        group: "family-1",
        guests: [{ firstName: "Jeanne", labels: { yes: "Présente", no: "Absente" } }],
        moments: [C, D],
        answer: {
            at: { days: 10, hours: 1 },
            by: "couple",
            moments: { [C]: "yes", [D]: "yes" },
            diets: { Jeanne: "gluten-free" },
            message: "Au téléphone : « J'apporte mon châle, et je danserai au moins une valse. »",
        },
    },
    {
        id: "petit",
        name: "Lucas & Emma Petit",
        group: "family-2",
        guests: ["Lucas", "Emma"],
        moments: ALL,
    },
    {
        id: "garcia",
        name: "Sofia Garcia",
        group: "friends",
        guests: [{ firstName: "Sofia", labels: { yes: "Présente", no: "Absente" } }],
        moments: ALL,
        answer: {
            at: { hours: 2, minutes: 18 },
            moments: yesAll,
            diets: { Sofia: "vegetarian" },
            song: "Daft Punk — One More Time",
            message: "Je viens avec mes plus belles chaussures (plates, promis, pour la pelouse).",
        },
    },
    {
        id: "martin",
        name: "Famille Martin",
        group: "family-1",
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
        group: "family-1",
        guests: ["Nathalie", "Éric"],
        moments: [C, D],
        seen: { days: 2, hours: 5 },
    },
    {
        id: "lambert",
        name: "Chloé Lambert",
        group: "colleagues",
        guests: [{ firstName: "Chloé", labels: { yes: "Présente", no: "Absente" } }],
        moments: [C],
        answer: { at: { days: 4, hours: 7 }, moments: { [C]: "yes" } },
    },
    {
        id: "fontaine",
        name: "Antoine & Sarah Fontaine",
        group: "friends",
        guests: ["Antoine", "Sarah"],
        moments: ALL,
        answer: {
            at: { days: 7, hours: 2 },
            moments: yesAll,
            diets: { Sarah: "vegetarian" },
            song: "Elvis Presley — Jailhouse Rock",
            message: "On réserve la piste pour le rock, prévenez l'orchestre !",
        },
    },
    {
        id: "girard",
        name: "Michel & Anne Girard",
        group: "family-2",
        guests: ["Michel", "Anne"],
        moments: ALL,
        answer: { at: { days: 8, hours: 1 }, moments: { [C]: "yes", [D]: "yes", [B]: "no" } },
    },
    {
        id: "bonnet",
        name: "Hélène Bonnet",
        group: "family-1",
        guests: ["Hélène"],
        moments: [C, D],
    },
    {
        id: "dupont",
        name: "Maxime & Julie Dupont",
        group: "friends",
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
        group: "family-2",
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
            diets: { Laure: "gluten-free" },
        },
    },
    {
        id: "blanc",
        name: "Pierre Blanc",
        group: "colleagues",
        guests: ["Pierre"],
        moments: [C],
        seen: { days: 3, hours: 6 },
    },
    {
        id: "faure",
        name: "Léa & Nicolas Faure",
        group: "friends",
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
        group: "friends",
        guests: ["Mathilde"],
        moments: ALL,
    },
    {
        id: "robin",
        name: "Papi André",
        group: "family-2",
        guests: ["André"],
        moments: [C, D],
        answer: { at: { days: 15 }, by: "couple", moments: { [C]: "yes", [D]: "no" } },
    },
    {
        id: "morel",
        name: "Yanis & Clara Morel",
        group: "colleagues",
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
        group: "family-1",
        guests: ["Olivier", "Isabelle", { firstName: "Noé", child: true }],
        moments: ALL,
        seen: { days: 9, hours: 2 },
    },
    {
        id: "caron",
        name: "Emma Caron",
        group: "friends",
        guests: [{ firstName: "Emma", labels: { yes: "Présente", no: "Absente" } }],
        moments: ALL,
        answer: {
            at: { hours: 20 },
            moments: { [C]: "yes", [D]: "yes", [B]: "no" },
            diets: { Emma: "vegetarian" },
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
        title: "Témoin de Camille",
        role: "witness",
        added: [],
        removed: [],
        invited: { days: 24 },
        joined: { days: 23, hours: 20 },
    },
    {
        id: "malik",
        firstName: "Malik",
        email: "malik.benali@exemple.fr",
        title: "Témoin de Hugo",
        role: "witness",
        added: ["reminders.read"],
        removed: [],
        invited: { days: 5 },
    },
    {
        id: "agathe",
        firstName: "Agathe",
        email: "agathe@atelier-agathe.exemple.fr",
        title: "",
        role: "planner",
        added: [],
        removed: [],
        invited: { hours: 20 },
    },
];

const COUPLE: Actor = { kind: "couple" };

const collaboratorCommands = (plan: CollaboratorPlan, now: Date): readonly TimedCommand[] => {
    const { invited, joined, id, firstName, email, title, role, added, removed } = plan;
    return [
        {
            command: {
                type: "collaborator.invite",
                draft: { firstName, email, title, role, added, removed },
            },
            actor: COUPLE,
            at: ago(now, invited),
            id,
        },
        ...(joined
            ? [
                  {
                      command: { type: "collaborator.join", collaboratorId: id } as const,
                      actor: { kind: "invitee", collaboratorId: id } as const,
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
    email: plan.email ?? "",
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

const answerCommand = (
    plan: HouseholdPlan,
    household: HouseholdRecord,
    now: Date,
): readonly TimedCommand[] => {
    if (!plan.answer) return [];
    const { at, by, moments, except = {}, diets = {}, song, message = "" } = plan.answer;
    return [
        {
            command: {
                type: "household.answer",
                householdId: household.id,
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
                                        : { choice: "other" as const, other: diet.other },
                                ],
                            ];
                        }),
                    ),
                    consent: Object.keys(diets).length > 0,
                    questions: song ? { chanson: song } : {},
                    message,
                },
            },
            actor: by === "couple" ? COUPLE : { kind: "guest", householdId: household.id },
            at: ago(now, at),
        },
    ];
};

/** Every function of the Signature formula is open while the seed is replayed. */
const ALL_FLAGS = new Set(FLAGS);

/** One event replayed: the ids it needs are the plan's own, then numbered. */
const replay = (state: WeddingState, event: TimedCommand, index: number): WeddingState => {
    const ids = [...(event.id ? [event.id] : []), `seed-${index}-a`, `seed-${index}-b`];
    const counter = { next: 0 };
    const result = runCommand(state, event.command, {
        at: event.at,
        actor: event.actor,
        flags: ALL_FLAGS,
        newId: () => ids[counter.next++] ?? `seed-${index}-${counter.next}`,
    });
    if (!result.ok)
        throw new Error(
            `Demo seed: ${event.command.type} refused, ${JSON.stringify(result.error)}`,
        );
    return result.value.state;
};

/**
 * The guest list as the couple finds it, a month after sending the faire-parts. The activity
 * feed is replayed through the wedding's commands, so it always reads like the dashboard writes
 * it.
 */
export const demoSeed = (now: Date): WeddingState => {
    const households = plans.map((plan) => invited(plan, now));
    const events: readonly TimedCommand[] = [
        ...plans.flatMap((plan, index): readonly TimedCommand[] =>
            plan.seen
                ? [
                      {
                          command: { type: "household.open", householdId: plan.id },
                          actor: { kind: "guest", householdId: plan.id },
                          at: ago(now, plan.seen),
                      },
                  ]
                : answerCommand(plan, households[index], now),
        ),
        { command: { type: "reminders.send" }, actor: COUPLE, at: ago(now, { days: 9, hours: 5 }) },
        ...collaborators.flatMap((plan) => collaboratorCommands(plan, now)),
    ];
    const start: WeddingState = {
        version: 1,
        timezone: "Europe/Paris",
        settings: { contactEmail: "camille.hugo@exemple.fr", domain: "camille-et-hugo.fr" },
        design: defaultDesign,
        groups,
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
        moments: plansFromMoments(weddingDemo.moments, CONTENT_WEDDING_DAY, D),
        questions: weddingDemo.questions,
        tables,
        dates: { answerDeadline: null, reminder: null, galleryOpens: null, tablesReveal: null },
        room: {
            name: "L'orangerie",
            size: "s",
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
    return [...events].sort((a, b) => a.at.localeCompare(b.at)).reduce(replay, start);
};
