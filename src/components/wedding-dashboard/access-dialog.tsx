"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    ACCESS_FEATURES,
    createCollaborator,
    INVITATION_HOURS,
    levelName,
    ofPerson,
    templateGrant,
    templateNames,
    templateOf,
    validateCollaboratorDraft,
    withLevel,
    type AccessLevel,
    type AccessTemplate,
    type Collaborator,
    type CollaboratorDraft,
} from "@/lib/wedding-dashboard/access";
import { householdIdFor, type DraftIssue } from "@/lib/wedding-dashboard/drafts";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { cormorant } from "@/app/fonts/wedding";

import { buttonStyles, FieldError, iconButton, inputStyles, issueMessages } from "./dashboard-ui";

type AccessDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Null for a new invitation. */
    editing: Collaborator | null;
    /** The couple's first names, for the role's example. */
    couple: { first: string; second: string };
    /** Addresses that already have access. */
    taken: readonly string[];
    onInvite: (collaborator: Collaborator) => void;
    onUpdate: (collaborator: Collaborator, draft: CollaboratorDraft) => void;
};

const templates: readonly { key: AccessTemplate; detail: string }[] = [
    {
        key: "temoin",
        detail: "Voit les invités, sans les régimes ; gère le plan de table et la galerie.",
    },
    { key: "planner", detail: "Voit et modifie tout, sauf les accès." },
];

const checkedTone: Record<AccessLevel, string> = {
    aucun: "peer-checked:bg-wed-paper peer-checked:text-wed-muted peer-checked:shadow-sm",
    lecture: "peer-checked:bg-wed-paper peer-checked:text-wed-ink peer-checked:shadow-sm",
    modification: "peer-checked:bg-wed-ink peer-checked:text-wed-paper",
};

const issueAt = (issues: readonly DraftIssue[], path: string) =>
    issues.find((issue) => issue.path === path);

/** Short random suffix: two Julien never share an id. */
const randomSuffix = () => Math.random().toString(36).slice(2, 6);

/** One row per function: hidden, read or edit, as a segmented choice. */
const GrantFields = ({
    draft,
    onChange,
}: {
    draft: CollaboratorDraft;
    onChange: (draft: CollaboratorDraft) => void;
}) => (
    <ul className="divide-wed-line-soft border-wed-line-soft divide-y rounded-2xl border">
        {ACCESS_FEATURES.map((feature) => {
            const id = `acces-${feature.key.replace(".", "-")}`;
            const locked = Boolean(feature.requires && draft.grant[feature.requires] === "aucun");
            return (
                <li
                    key={feature.key}
                    className={cn(
                        "grid gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
                        feature.requires && "bg-wed-ivory/60 sm:pl-8",
                    )}
                >
                    <div className="min-w-0">
                        <p id={id} className="text-sm font-medium">
                            {feature.label}
                        </p>
                        <p id={`${id}-aide`} className="text-wed-muted text-xs">
                            {locked ? "Ouvrez d'abord la liste des invités." : feature.hint}
                        </p>
                    </div>
                    <div
                        role="radiogroup"
                        aria-labelledby={id}
                        aria-describedby={`${id}-aide`}
                        className={cn(
                            "bg-wed-line-soft inline-flex justify-self-start rounded-full p-1",
                            locked && "opacity-50",
                        )}
                    >
                        {feature.levels.map((level) => (
                            <label key={level} className="relative">
                                <input
                                    type="radio"
                                    name={id}
                                    value={level}
                                    checked={draft.grant[feature.key] === level}
                                    disabled={locked}
                                    onChange={() =>
                                        onChange({
                                            ...draft,
                                            grant: withLevel(draft.grant, feature.key, level),
                                        })
                                    }
                                    className="peer sr-only"
                                />
                                <span
                                    className={cn(
                                        "text-wed-ink-soft peer-focus-visible:outline-wed-ink inline-flex min-h-10 cursor-pointer items-center rounded-full px-3.5 text-[0.8rem] font-medium transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-disabled:cursor-not-allowed",
                                        checkedTone[level],
                                    )}
                                >
                                    {levelName(feature, level)}
                                </span>
                            </label>
                        ))}
                    </div>
                </li>
            );
        })}
    </ul>
);

const AccessForm = ({
    editing,
    couple,
    taken,
    onInvite,
    onUpdate,
}: Omit<AccessDialogProps, "open" | "onOpenChange">) => {
    const [draft, setDraft] = useState<CollaboratorDraft>(
        editing ?? { firstName: "", email: "", role: "", grant: templateGrant("temoin") },
    );
    const [issues, setIssues] = useState<readonly DraftIssue[]>([]);
    const template = templateOf(draft.grant);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = validateCollaboratorDraft(draft, taken);
        if (!result.ok) return setIssues(result.error);
        if (editing) return onUpdate(editing, result.value);
        onInvite(
            createCollaborator(result.value, {
                id: householdIdFor(result.value.firstName, randomSuffix()),
                at: new Date().toISOString(),
            }),
        );
    };

    const firstNameIssue = issueAt(issues, "firstName");
    const emailIssue = issueAt(issues, "email");
    const roleIssue = issueAt(issues, "role");
    const grantIssue = issueAt(issues, "grant");

    return (
        <form
            noValidate
            onSubmit={submit}
            aria-label={editing ? `Accès ${ofPerson(editing.firstName)}` : "Nouvelle invitation"}
            className="grid gap-5"
        >
            {issues.length > 0 && (
                <p
                    role="alert"
                    className="border-wed-no/40 text-wed-no rounded-xl border p-3 text-sm"
                >
                    Il reste {issues.length} {issues.length > 1 ? "points" : "point"} à compléter.
                </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid content-start gap-1.5 text-sm">
                    <span className="text-wed-ink-soft">Prénom</span>
                    <input
                        value={draft.firstName}
                        onChange={(event) => setDraft({ ...draft, firstName: event.target.value })}
                        disabled={Boolean(editing)}
                        autoComplete="off"
                        aria-invalid={Boolean(firstNameIssue)}
                        aria-describedby={firstNameIssue ? "acces-prenom-erreur" : undefined}
                        className={cn(inputStyles, "disabled:bg-wed-ivory disabled:text-wed-muted")}
                    />
                    <FieldError
                        id="acces-prenom-erreur"
                        message={firstNameIssue && issueMessages[firstNameIssue.code]}
                    />
                </label>
                <label className="grid content-start gap-1.5 text-sm">
                    <span className="text-wed-ink-soft">
                        Rôle <small className="text-wed-muted">(facultatif)</small>
                    </span>
                    <input
                        value={draft.role}
                        onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                        placeholder={`Témoin de ${couple.first}…`}
                        autoComplete="off"
                        aria-invalid={Boolean(roleIssue)}
                        aria-describedby={roleIssue ? "acces-role-erreur" : undefined}
                        className={inputStyles}
                    />
                    <FieldError
                        id="acces-role-erreur"
                        message={roleIssue && issueMessages[roleIssue.code]}
                    />
                </label>
            </div>
            <label className="grid gap-1.5 text-sm">
                <span className="text-wed-ink-soft">E-mail</span>
                <input
                    type="email"
                    value={draft.email}
                    onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                    disabled={Boolean(editing)}
                    autoComplete="off"
                    aria-invalid={Boolean(emailIssue)}
                    aria-describedby={cn("acces-email-aide", emailIssue && "acces-email-erreur")}
                    className={cn(inputStyles, "disabled:bg-wed-ivory disabled:text-wed-muted")}
                />
                <span id="acces-email-aide" className="text-wed-muted text-xs">
                    {editing
                        ? "L'accès est lié à cette adresse. Pour en changer, retirez cet accès et invitez la nouvelle."
                        : `Le lien de connexion n'ouvre que pour elle, et l'invitation dure ${INVITATION_HOURS} h.`}
                </span>
                <FieldError
                    id="acces-email-erreur"
                    message={emailIssue && issueMessages[emailIssue.code]}
                />
            </label>

            <section aria-labelledby="acces-fonctions" className="grid gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 id="acces-fonctions" className="text-sm font-semibold">
                        Ce qu&apos;elle ou il peut faire
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-wed-muted text-xs">Modèle :</span>
                        {templates.map(({ key }) => (
                            <button
                                key={key}
                                type="button"
                                aria-pressed={template === key}
                                onClick={() => setDraft({ ...draft, grant: templateGrant(key) })}
                                className={cn(
                                    buttonStyles.secondary,
                                    "aria-pressed:bg-wed-ink aria-pressed:text-wed-paper aria-pressed:border-wed-ink min-h-9 px-3.5 text-[0.8rem]",
                                )}
                            >
                                {templateNames[key]}
                            </button>
                        ))}
                        {template === "sur-mesure" && (
                            <span className="border-wed-line text-wed-ink-soft rounded-full border border-dashed px-3 py-1.5 text-[0.8rem]">
                                {templateNames["sur-mesure"]}
                            </span>
                        )}
                    </div>
                </div>
                <p className="text-wed-muted text-xs" aria-live="polite">
                    {templates.find(({ key }) => key === template)?.detail ??
                        "Réglé fonction par fonction."}
                </p>
                <GrantFields
                    draft={draft}
                    onChange={(next) => {
                        setDraft(next);
                        setIssues(issues.filter((issue) => issue.path !== "grant"));
                    }}
                />
                <FieldError
                    id="acces-fonctions-erreur"
                    message={grantIssue && issueMessages[grantIssue.code]}
                />
                <p className="text-wed-muted text-xs">
                    Toujours réservés à vous deux : gérer les accès, l&apos;export complet et votre
                    formule.
                </p>
            </section>

            <button type="submit" className={cn(buttonStyles.primary, "min-h-12 w-full")}>
                {editing ? "Enregistrer les accès" : "Envoyer l'invitation"}
            </button>
        </form>
    );
};

const SentPanel = ({
    collaborator,
    onAnother,
}: {
    collaborator: Collaborator;
    onAnother: () => void;
}) => (
    <div role="status" className="grid gap-5">
        <div>
            <p className="font-wed-serif text-3xl leading-tight">
                Invitation envoyée à {collaborator.firstName}
            </p>
            <p className="text-wed-muted mt-1.5 text-sm">
                En vrai, {collaborator.email} reçoit un e-mail avec un lien valable{" "}
                {INVITATION_HOURS} h, qui ne sert qu&apos;à cette adresse. Ici, rien ne part.
            </p>
        </div>
        <div className="flex flex-wrap gap-2">
            <Dialog.Close className={buttonStyles.primary}>Terminé</Dialog.Close>
            <button type="button" onClick={onAnother} className={buttonStyles.quiet}>
                <Plus aria-hidden="true" />
                Inviter quelqu&apos;un d&apos;autre
            </button>
        </div>
    </div>
);

const DialogBody = (props: Omit<AccessDialogProps, "open" | "onOpenChange">) => {
    const [sent, setSent] = useState<Collaborator | null>(null);
    const [round, setRound] = useState(0);

    useScrollLock();

    return sent ? (
        <SentPanel
            collaborator={sent}
            onAnother={() => {
                setSent(null);
                setRound((current) => current + 1);
            }}
        />
    ) : (
        <AccessForm
            key={round}
            {...props}
            onInvite={(collaborator) => {
                props.onInvite(collaborator);
                setSent(collaborator);
            }}
        />
    );
};

/** « Inviter une personne » or « Modifier ses accès »: who comes in, and to do what. */
export const AccessDialog = ({ open, onOpenChange, ...body }: AccessDialogProps) => (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
            <Dialog.Overlay className="bg-wed-night/55 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50" />
            <Dialog.Content
                data-lenis-prevent
                /* Portalled outside the page: it brings its own display font. */
                className={`${cormorant.variable} bg-wed-paper text-wed-ink font-main data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] motion-reduce:animate-none sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[min(40rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:p-7`}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <Dialog.Title className="font-wed-serif text-3xl leading-tight font-medium">
                            {body.editing
                                ? `Accès ${ofPerson(body.editing.firstName)}`
                                : "Inviter une personne"}
                        </Dialog.Title>
                        <Dialog.Description className="text-wed-muted mt-1 text-sm">
                            {body.editing
                                ? "Les changements s'appliquent dès sa prochaine action."
                                : "Témoin, wedding planner, parent : vous choisissez ce qu'elle ou il voit et modifie."}
                        </Dialog.Description>
                    </div>
                    <Dialog.Close aria-label="Fermer" className={iconButton}>
                        <X aria-hidden="true" />
                    </Dialog.Close>
                </div>
                {open && <DialogBody key={body.editing?.id ?? "nouveau"} {...body} />}
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);
