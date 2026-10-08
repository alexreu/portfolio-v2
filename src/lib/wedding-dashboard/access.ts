import { failure, success, type Result } from "@/lib/wedding/result";

import type { DraftIssue } from "./drafts";

/** What a person the couple invited may do with one function of the dashboard. */
export type AccessLevel = "aucun" | "lecture" | "modification";

export type AccessFeature =
    | "invites"
    | "invites.regimes"
    | "invites.export"
    | "dates"
    | "programme"
    | "faire-part"
    | "questions-perso"
    | "plan-de-table"
    | "relances"
    | "galerie";

export type AccessGrant = Readonly<Record<AccessFeature, AccessLevel>>;

export type FeatureSpec = {
    readonly key: AccessFeature;
    readonly label: string;
    /** In the summary of someone's access: "plan de table". */
    readonly short: string;
    readonly hint: string;
    /** From hidden to the most the function allows. */
    readonly levels: readonly AccessLevel[];
    /** Where "Modifier" would not say it: "Exporter", "Envoyer". */
    readonly names?: Partial<Record<AccessLevel, string>>;
    /** Only open while that function is. */
    readonly requires?: AccessFeature;
};

const ALL: readonly AccessLevel[] = ["aucun", "lecture", "modification"];

/**
 * The functions the couple opens one by one: finer than the sections where the data asks for
 * it, such as diets, which may say something about a guest's health.
 */
export const ACCESS_FEATURES: readonly FeatureSpec[] = [
    {
        key: "invites",
        label: "Invités",
        short: "invités",
        hint: "Foyers, réponses et liens personnels",
        levels: ALL,
    },
    {
        key: "invites.regimes",
        label: "Régimes et allergies",
        short: "régimes",
        hint: "Données de santé : à n'ouvrir qu'en cas de besoin",
        levels: ["aucun", "lecture"],
        requires: "invites",
    },
    {
        key: "invites.export",
        label: "Export pour le traiteur",
        short: "export CSV",
        hint: "Télécharger la liste des invités",
        levels: ["aucun", "modification"],
        names: { modification: "Exporter" },
        requires: "invites",
    },
    {
        key: "dates",
        label: "Dates",
        short: "dates",
        hint: "Jour J, date limite, galerie",
        levels: ALL,
    },
    {
        key: "programme",
        label: "Programme",
        short: "programme",
        hint: "Moments, horaires et lieux",
        levels: ALL,
    },
    {
        key: "faire-part",
        label: "Faire-part",
        short: "faire-part",
        hint: "Textes, sceau et mot d'accueil",
        levels: ALL,
    },
    {
        key: "questions-perso",
        label: "Questions du faire-part",
        short: "questions",
        hint: "Ce qui est demandé aux invités",
        levels: ALL,
    },
    {
        key: "plan-de-table",
        label: "Plan de table",
        short: "plan de table",
        hint: "Salle, tables et placement",
        levels: ALL,
    },
    {
        key: "relances",
        label: "Relances",
        short: "relances",
        hint: "Suivi et envoi des relances",
        levels: ALL,
        names: { modification: "Envoyer" },
    },
    {
        key: "galerie",
        label: "Galerie",
        short: "galerie",
        hint: "Photos des invités, retrait d'une photo",
        levels: ALL,
    },
];

export const levelNames: Readonly<Record<AccessLevel, string>> = {
    aucun: "Masqué",
    lecture: "Voir",
    modification: "Modifier",
};

export const levelName = (feature: FeatureSpec, level: AccessLevel) =>
    feature.names?.[level] ?? levelNames[level];

const RANK: Readonly<Record<AccessLevel, number>> = { aucun: 0, lecture: 1, modification: 2 };

const grantWith = (level: (feature: FeatureSpec) => AccessLevel): AccessGrant =>
    Object.fromEntries(
        ACCESS_FEATURES.map((feature) => [feature.key, level(feature)]),
    ) as AccessGrant;

export const noGrant: AccessGrant = grantWith(() => "aucun");

/** Hidden functions take their dependants with them; a level a function lacks is refused. */
const consistent = (grant: AccessGrant): AccessGrant =>
    grantWith((feature) =>
        feature.requires && grant[feature.requires] === "aucun" ? "aucun" : grant[feature.key],
    );

export const withLevel = (
    grant: AccessGrant,
    key: AccessFeature,
    level: AccessLevel,
): AccessGrant => {
    const feature = ACCESS_FEATURES.find((candidate) => candidate.key === key);
    if (!feature?.levels.includes(level)) return grant;
    if (feature.requires && grant[feature.requires] === "aucun") return grant;
    return consistent({ ...grant, [key]: level });
};

export type AccessTemplate = "temoin" | "planner";

export const templateNames: Readonly<Record<AccessTemplate | "sur-mesure", string>> = {
    temoin: "Témoin",
    planner: "Wedding planner",
    "sur-mesure": "Sur mesure",
};

const highest = (feature: FeatureSpec) => feature.levels[feature.levels.length - 1];

/** Two starting points, adjusted function by function afterwards. */
export const templateGrant = (template: AccessTemplate): AccessGrant =>
    template === "planner"
        ? grantWith(highest)
        : {
              ...noGrant,
              invites: "lecture",
              "plan-de-table": "modification",
              galerie: "modification",
          };

const sameGrant = (a: AccessGrant, b: AccessGrant) =>
    ACCESS_FEATURES.every((feature) => a[feature.key] === b[feature.key]);

export const templateOf = (grant: AccessGrant): AccessTemplate | "sur-mesure" =>
    (["temoin", "planner"] as const).find((template) =>
        sameGrant(grant, templateGrant(template)),
    ) ?? "sur-mesure";

/** A stored copy may be old or edited by hand: unknown functions and levels are dropped. */
export const grantOf = (stored: Readonly<Record<string, string>>): AccessGrant =>
    consistent(
        grantWith((feature) => {
            const level = stored[feature.key];
            return feature.levels.find((candidate) => candidate === level) ?? "aucun";
        }),
    );

const named = (grant: AccessGrant, level: AccessLevel) =>
    ACCESS_FEATURES.filter((feature) => grant[feature.key] === level).map(
        (feature) => feature.short,
    );

/** "Modifie : plan de table, galerie · Voit : invités". */
export const accessSummary = (grant: AccessGrant) => {
    if (sameGrant(grant, grantWith(highest))) return "Tout voir, tout modifier";
    const parts = [
        ["Modifie", named(grant, "modification")],
        ["Voit", named(grant, "lecture")],
    ] as const;
    const said = parts.flatMap(([verb, names]) =>
        names.length > 0 ? [`${verb} : ${names.join(", ")}`] : [],
    );
    return said.length > 0 ? said.join(" · ") : "Aucun accès";
};

export const isOpen = (grant: AccessGrant) =>
    ACCESS_FEATURES.some((feature) => RANK[grant[feature.key]] > 0);

/** A witness, a planner, a parent: someone the couple let into their dashboard. */
export type Collaborator = {
    readonly id: string;
    readonly firstName: string;
    /** The invitation is tied to it: forwarded to someone else, it opens nothing. */
    readonly email: string;
    /** "Témoin de Camille"; empty shows the template's name. */
    readonly role: string;
    readonly grant: AccessGrant;
    readonly invitedAt: string;
    /** Null until the invitation is accepted. */
    readonly joinedAt: string | null;
};

export type CollaboratorDraft = Pick<Collaborator, "firstName" | "email" | "role" | "grant">;

export const INVITATION_HOURS = 72;

export type CollaboratorStatus =
    | { readonly kind: "active"; readonly since: string }
    | { readonly kind: "pending"; readonly expiresAt: string }
    | { readonly kind: "expired" };

export const collaboratorStatus = (collaborator: Collaborator, now: Date): CollaboratorStatus => {
    if (collaborator.joinedAt) return { kind: "active", since: collaborator.joinedAt };
    const expiresAt = new Date(
        new Date(collaborator.invitedAt).getTime() + INVITATION_HOURS * 3_600_000,
    );
    return expiresAt.getTime() > now.getTime()
        ? { kind: "pending", expiresAt: expiresAt.toISOString() }
        : { kind: "expired" };
};

/** "d'Elsa", "de Malik": after "Accès", "les accès". */
export const ofPerson = (name: string) =>
    /^[aeiouyàâéèêëîïôûü]/i.test(name) ? `d'${name}` : `de ${name}`;

/** "Témoin de Camille", or the template the access matches. */
export const roleLabel = (collaborator: Pick<Collaborator, "role" | "grant">) =>
    collaborator.role || templateNames[templateOf(collaborator.grant)];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailIssues = (email: string, taken: readonly string[]): readonly DraftIssue[] => {
    if (email === "") return [{ path: "email", code: "required" }];
    if (!EMAIL.test(email)) return [{ path: "email", code: "email-invalid" }];
    return taken.some((candidate) => candidate.toLowerCase() === email)
        ? [{ path: "email", code: "email-taken" }]
        : [];
};

/** `taken`: the addresses that already have access, the couple's included. */
export const validateCollaboratorDraft = (
    draft: CollaboratorDraft,
    taken: readonly string[],
): Result<CollaboratorDraft, readonly DraftIssue[]> => {
    const firstName = draft.firstName.trim();
    const email = draft.email.trim().toLowerCase();
    const role = draft.role.trim();
    const issues: readonly DraftIssue[] = [
        ...(firstName === "" ? [{ path: "firstName", code: "required" as const }] : []),
        ...(firstName.length > 40 ? [{ path: "firstName", code: "too-long" as const }] : []),
        ...emailIssues(email, taken),
        ...(role.length > 40 ? [{ path: "role", code: "too-long" as const }] : []),
        ...(isOpen(draft.grant) ? [] : [{ path: "grant", code: "access-required" as const }]),
    ];
    return issues.length > 0
        ? failure(issues)
        : success({ firstName, email, role, grant: consistent(draft.grant) });
};

export const createCollaborator = (
    draft: CollaboratorDraft,
    { id, at }: { id: string; at: string },
): Collaborator => ({ id, ...draft, invitedAt: at, joinedAt: null });

/** "expire dans 2 j", then by the hour on the last day. */
export const expiryLabel = (expiresAt: string, now: Date) => {
    const hours = Math.floor((new Date(expiresAt).getTime() - now.getTime()) / 3_600_000);
    if (hours >= 24) return `expire dans ${Math.floor(hours / 24)} j`;
    return hours >= 1 ? `expire dans ${hours} h` : "expire dans moins d'1 h";
};
