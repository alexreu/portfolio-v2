"use client";

import { useState } from "react";
import {
    FLAGS,
    type CommandIssue,
    type Flag,
    type HouseholdGroup,
    type HouseholdRecord,
    type WeddingSettings,
} from "@alexreu/wedding-core";
import { Check, Download, Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

import {
    buttonStyles,
    Card,
    FieldError,
    iconButton,
    inputStyles,
    plural,
    Select,
} from "./dashboard-ui";

/** The time zones of the weddings AlexDevLab works for: mainland France and overseas. */
const TIME_ZONES: readonly { value: string; label: string }[] = [
    { value: "Europe/Paris", label: "France, Belgique, Suisse" },
    { value: "Indian/Reunion", label: "La Réunion" },
    { value: "Indian/Mauritius", label: "Maurice" },
    { value: "Indian/Mayotte", label: "Mayotte" },
    { value: "America/Guadeloupe", label: "Guadeloupe" },
    { value: "America/Martinique", label: "Martinique" },
    { value: "America/Cayenne", label: "Guyane" },
    { value: "Pacific/Noumea", label: "Nouvelle-Calédonie" },
    { value: "Pacific/Tahiti", label: "Polynésie française" },
];

const Saved = ({ shown, children }: { shown: boolean; children: string }) => (
    <p role="status" className="text-wed-yes flex items-center gap-1.5 text-sm">
        {shown && (
            <>
                <Check aria-hidden="true" className="size-4" />
                {children}
            </>
        )}
    </p>
);

type GroupDraft = { readonly id?: string; readonly label: string };

/** The couple's own groups: renamed, added, removed; a household of a removed group keeps none. */
export const GroupsSection = ({
    groups,
    households,
    onSave,
}: {
    groups: readonly HouseholdGroup[];
    households: readonly HouseholdRecord[];
    onSave: (groups: readonly GroupDraft[]) => readonly CommandIssue[];
}) => {
    const [draft, setDraft] = useState<readonly GroupDraft[]>(groups);
    const [base, setBase] = useState(groups);
    if (groups !== base) {
        setBase(groups);
        setDraft(groups);
    }
    const [issues, setIssues] = useState<readonly CommandIssue[]>([]);
    const [saved, setSaved] = useState(false);
    const dirty = JSON.stringify(draft) !== JSON.stringify(groups);
    const count = (id: string | undefined) =>
        id ? households.filter((household) => household.group === id).length : 0;

    const change = (next: readonly GroupDraft[]) => {
        setDraft(next);
        setSaved(false);
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const refused = onSave(draft);
        setIssues(refused);
        setSaved(refused.length === 0);
    };

    return (
        <Card id="groupes" title="Groupes d'invités" titleId="groupes-titre">
            <form
                noValidate
                onSubmit={submit}
                aria-label="Groupes d'invités"
                className="grid gap-4 px-5 py-4"
            >
                <p className="text-wed-muted text-sm">
                    Pour trier la liste et l&apos;export : familles, amis, collègues, ou ce que vous
                    voulez. Un foyer d&apos;un groupe retiré reste dans la liste, sans groupe.
                </p>
                <ul className="grid gap-2.5">
                    {draft.map((group, index) => {
                        const issue = issues.find(
                            (candidate) => candidate.path === `groups.${index}.label`,
                        );
                        const errorId = `group-${index}-error`;
                        return (
                            <li
                                key={group.id ?? `new-${index}`}
                                className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2"
                            >
                                <label className="grid gap-1 text-sm">
                                    <span className="sr-only">Groupe {index + 1}</span>
                                    <input
                                        value={group.label}
                                        onChange={(event) =>
                                            change(
                                                draft.map((candidate, at) =>
                                                    at === index
                                                        ? {
                                                              ...candidate,
                                                              label: event.target.value,
                                                          }
                                                        : candidate,
                                                ),
                                            )
                                        }
                                        placeholder="Amis du rugby"
                                        aria-invalid={Boolean(issue)}
                                        aria-describedby={issue ? errorId : `group-${index}-count`}
                                        className={inputStyles}
                                    />
                                    <span
                                        id={`group-${index}-count`}
                                        className="text-wed-muted text-xs"
                                    >
                                        {plural(count(group.id), "foyer", "foyers")}
                                    </span>
                                    <FieldError
                                        id={errorId}
                                        message={
                                            issue &&
                                            "Donnez un nom au groupe, 40 caractères au plus."
                                        }
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => change(draft.filter((_, at) => at !== index))}
                                    aria-label={`Retirer le groupe ${group.label || index + 1}`}
                                    className={iconButton}
                                >
                                    <Trash2 aria-hidden="true" />
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => change([...draft, { label: "" }])}
                        className={buttonStyles.secondary}
                    >
                        <Plus aria-hidden="true" />
                        Ajouter un groupe
                    </button>
                    <button type="submit" disabled={!dirty} className={buttonStyles.primary}>
                        Enregistrer les groupes
                    </button>
                    <Saved shown={saved && !dirty}>Groupes enregistrés.</Saved>
                </div>
            </form>
        </Card>
    );
};

type SiteDraft = { readonly timezone: string } & WeddingSettings;

const siteMessages: Readonly<Record<string, string>> = {
    timezone: "Choisissez le fuseau du lieu du mariage.",
    contactEmail: "Cette adresse ne semble pas complète.",
    domain: "Une adresse comme camille-et-hugo.fr.",
};

/** Where the site lives, who guests write to, and where the wedding takes place. */
export const SiteSection = ({
    timezone,
    settings,
    onSave,
}: {
    timezone: string;
    settings: WeddingSettings;
    onSave: (draft: SiteDraft) => readonly CommandIssue[];
}) => {
    const initial = { timezone, ...settings };
    const [draft, setDraft] = useState<SiteDraft>(initial);
    const [base, setBase] = useState(initial);
    if (JSON.stringify(initial) !== JSON.stringify(base)) {
        setBase(initial);
        setDraft(initial);
    }
    const [issues, setIssues] = useState<readonly CommandIssue[]>([]);
    const [saved, setSaved] = useState(false);
    const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
    const issueAt = (path: string) => issues.find((issue) => issue.path === path);
    const known = TIME_ZONES.some((zone) => zone.value === draft.timezone);

    const change = (patch: Partial<SiteDraft>) => {
        setDraft({ ...draft, ...patch });
        setSaved(false);
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const refused = onSave(draft);
        setIssues(refused);
        setSaved(refused.length === 0);
    };

    const field = (path: keyof SiteDraft, label: string, hint: string, input: React.ReactNode) => (
        <div className="grid content-start gap-1.5 text-sm">
            <label htmlFor={`site-${path}`} className="text-wed-ink-soft">
                {label}
            </label>
            {input}
            <span id={`site-${path}-hint`} className="text-wed-muted text-xs">
                {hint}
            </span>
            <FieldError id={`site-${path}-error`} message={issueAt(path) && siteMessages[path]} />
        </div>
    );

    const describedBy = (path: string) =>
        cn(`site-${path}-hint`, issueAt(path) && `site-${path}-error`);

    return (
        <Card id="site" title="Votre site" titleId="site-titre">
            <form
                noValidate
                onSubmit={submit}
                aria-label="Votre site"
                className="grid gap-4 px-5 py-4"
            >
                <div className="grid gap-4 md:grid-cols-3">
                    {field(
                        "domain",
                        "Adresse du site",
                        "Votre nom de domaine, inclus dans la formule.",
                        <input
                            id="site-domain"
                            value={draft.domain}
                            onChange={(event) => change({ domain: event.target.value })}
                            placeholder="camille-et-hugo.fr"
                            autoComplete="off"
                            aria-invalid={Boolean(issueAt("domain"))}
                            aria-describedby={describedBy("domain")}
                            className={inputStyles}
                        />,
                    )}
                    {field(
                        "contactEmail",
                        "Contact des invités",
                        "Affiché sur le site pour toute question. Vide : aucun.",
                        <input
                            id="site-contactEmail"
                            type="email"
                            value={draft.contactEmail}
                            onChange={(event) => change({ contactEmail: event.target.value })}
                            autoComplete="off"
                            aria-invalid={Boolean(issueAt("contactEmail"))}
                            aria-describedby={describedBy("contactEmail")}
                            className={inputStyles}
                        />,
                    )}
                    {field(
                        "timezone",
                        "Lieu du mariage",
                        "Toutes les heures du site s'y lisent : programme, galerie, tables.",
                        <Select
                            id="site-timezone"
                            value={draft.timezone}
                            onChange={(event) => change({ timezone: event.target.value })}
                            aria-invalid={Boolean(issueAt("timezone"))}
                            aria-describedby={describedBy("timezone")}
                        >
                            {!known && <option value={draft.timezone}>{draft.timezone}</option>}
                            {TIME_ZONES.map((zone) => (
                                <option key={zone.value} value={zone.value}>
                                    {zone.label}
                                </option>
                            ))}
                        </Select>,
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button type="submit" disabled={!dirty} className={buttonStyles.primary}>
                        Enregistrer
                    </button>
                    <Saved shown={saved && !dirty}>Enregistré, le site est à jour.</Saved>
                </div>
            </form>
        </Card>
    );
};

/** The functions a formula opens, as the couple reads them. */
const FUNCTION_NAMES: Partial<Readonly<Record<Flag, string>>> = {
    guests: "Liste des invités et réponses",
    "guests.export": "Export pour le traiteur",
    programme: "Programme et dates",
    invitation: "Faire-part animé",
    questions: "Vos propres questions",
    reminders: "Relance automatique",
    gallery: "Galerie des invités",
    "invitation-print": "Faire-part PDF + QR",
    countdown: "Compte à rebours",
    "dress-code.illustrated": "Dress code illustré",
    seating: "Plan de table numérique",
    "household-qr": "QR personnel par foyer",
    collaborators: "Co-gestion",
    bilingual: "Site bilingue",
};

/** « Votre formule » : what is included, and how to add an option. Never a sales pitch. */
export const OfferSection = ({ plan, flags }: { plan: string; flags: ReadonlySet<Flag> }) => (
    <Card id="formule" title={`Votre formule · ${plan}`} titleId="formule-titre">
        <div className="grid gap-3 px-5 py-4 text-sm">
            <ul className="grid gap-1.5 sm:grid-cols-2">
                {FLAGS.filter((flag) => flags.has(flag) && FUNCTION_NAMES[flag]).map((flag) => (
                    <li key={flag} className="flex items-center gap-2">
                        <Check aria-hidden="true" className="text-wed-yes size-4 shrink-0" />
                        {FUNCTION_NAMES[flag]}
                    </li>
                ))}
            </ul>
            <p className="text-wed-muted">
                Une option à ajouter ? Écrivez-nous : elle s&apos;active sans rien perdre de ce que
                vous avez déjà saisi.
            </p>
        </div>
    </Card>
);

/** What happens to the guests' data, and the whole wedding in one file before it goes. */
export const DataSection = ({ guests, onExport }: { guests: number; onExport: () => void }) => (
    <Card id="donnees" title="Vos données" titleId="donnees-titre">
        <div className="grid gap-3 px-5 py-4 text-sm">
            <p className="text-wed-ink-soft">
                Les réponses de vos {plural(guests, "invité", "invités")} ne sont jamais revendues.
                Elles sont supprimées trois mois après le mariage, les régimes alimentaires dès le
                premier mois. Avant cela, téléchargez tout : invités, réponses, programme, plan de
                table, en un seul fichier.
            </p>
            <div>
                <button type="button" onClick={onExport} className={buttonStyles.secondary}>
                    <Download aria-hidden="true" />
                    Télécharger toutes vos données
                </button>
            </div>
        </div>
    </Card>
);
