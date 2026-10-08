"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, ExternalLink, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    createHousehold,
    householdIdFor,
    validateHouseholdDraft,
    type DraftIssue,
    type HouseholdDraft,
} from "@/lib/wedding-dashboard/drafts";
import { groupLabel } from "@/lib/wedding-dashboard/households";
import type { GroupKey, HouseholdRecord, InvitationDesign } from "@/lib/wedding-dashboard/types";
import type { Moment } from "@/lib/wedding/types";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { cormorant } from "@/app/fonts/wedding";

import {
    buttonStyles,
    FieldError,
    iconButton,
    inputStyles,
    issueMessages,
    Select,
} from "./dashboard-ui";

type HouseholdDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    moments: readonly Moment[];
    design: InvitationDesign;
    linkFor: (household: HouseholdRecord) => string;
    onCreate: (household: HouseholdRecord) => void;
};

const MAX_GUESTS = 8;

const groups: readonly GroupKey[] = ["famille-1", "famille-2", "amis", "collegues"];

const messages = issueMessages;

const emptyDraft = (moments: readonly Moment[]): HouseholdDraft => ({
    name: "",
    group: "amis",
    email: "",
    guests: [{ firstName: "", child: false }],
    momentKeys: moments.map((moment) => moment.key),
});

const issueAt = (issues: readonly DraftIssue[], path: string) =>
    issues.find((issue) => issue.path === path);

/** Short random suffix: two « Famille Martin » never share a link. */
const randomSuffix = () => Math.random().toString(36).slice(2, 6);

const CreatedPanel = ({
    household,
    link,
    onAnother,
}: {
    household: HouseholdRecord;
    link: string;
    onAnother: () => void;
}) => {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
        } catch {
            window.prompt("Copiez le lien personnel :", link);
        }
    };
    return (
        <div role="status" className="grid gap-5">
            <div>
                <p className="font-wed-serif text-3xl leading-tight">
                    Le faire-part de {household.name} est prêt
                </p>
                <p className="text-wed-muted mt-1.5 text-sm">
                    En vrai, il part par e-mail, WhatsApp ou SMS. Ici, ouvrez-le comme si vous étiez
                    l&apos;invité : sa réponse arrivera dans votre tableau de bord.
                </p>
            </div>
            <label className="grid gap-1.5 text-sm">
                <span className="text-wed-ink-soft">Lien personnel</span>
                <input
                    readOnly
                    value={link}
                    onFocus={(event) => event.target.select()}
                    className={inputStyles}
                />
            </label>
            <div className="flex flex-wrap gap-2">
                <a href={link} target="_blank" rel="noopener" className={buttonStyles.primary}>
                    <ExternalLink aria-hidden="true" />
                    Ouvrir son faire-part
                </a>
                <button type="button" onClick={copy} className={buttonStyles.secondary}>
                    {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                    {copied ? "Lien copié" : "Copier le lien"}
                </button>
                <button type="button" onClick={onAnother} className={buttonStyles.quiet}>
                    <Plus aria-hidden="true" />
                    Un autre foyer
                </button>
            </div>
        </div>
    );
};

const HouseholdForm = ({
    moments,
    design,
    onCreate,
}: Pick<HouseholdDialogProps, "moments" | "design" | "onCreate">) => {
    const [draft, setDraft] = useState<HouseholdDraft>(() => emptyDraft(moments));
    const [issues, setIssues] = useState<readonly DraftIssue[]>([]);

    const setGuest = (index: number, change: Partial<HouseholdDraft["guests"][number]>) =>
        setDraft((current) => ({
            ...current,
            guests: current.guests.map((guest, at) =>
                at === index ? { ...guest, ...change } : guest,
            ),
        }));

    const toggleMoment = (key: string, checked: boolean) =>
        setDraft((current) => ({
            ...current,
            momentKeys: checked
                ? moments
                      .map((moment) => moment.key)
                      .filter(
                          (candidate) =>
                              candidate === key || current.momentKeys.includes(candidate),
                      )
                : current.momentKeys.filter((candidate) => candidate !== key),
        }));

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = validateHouseholdDraft(draft);
        if (!result.ok) return setIssues(result.error);
        const id = householdIdFor(result.value.name, randomSuffix());
        onCreate(createHousehold(result.value, { id, at: new Date().toISOString() }));
    };

    const nameIssue = issueAt(issues, "name");
    const momentIssue = issueAt(issues, "momentKeys");
    const emailIssue = issueAt(issues, "email");

    return (
        <form noValidate onSubmit={submit} aria-label="Nouveau faire-part" className="grid gap-5">
            {issues.length > 0 && (
                <p
                    role="alert"
                    className="border-wed-no/40 text-wed-no rounded-xl border p-3 text-sm"
                >
                    Il reste {issues.length} {issues.length > 1 ? "points" : "point"} à compléter.
                </p>
            )}
            <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
                <label className="grid gap-1.5 text-sm">
                    <span className="text-wed-ink-soft">Nom du foyer</span>
                    <input
                        value={draft.name}
                        onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                        placeholder="Famille Martin, Léa & Hugo…"
                        aria-invalid={Boolean(nameIssue)}
                        aria-describedby={nameIssue ? "foyer-nom-erreur" : undefined}
                        className={inputStyles}
                    />
                    <FieldError
                        id="foyer-nom-erreur"
                        message={nameIssue && messages[nameIssue.code]}
                    />
                </label>
                <label className="grid content-start gap-1.5 text-sm">
                    <span className="text-wed-ink-soft">Groupe</span>
                    <Select
                        value={draft.group}
                        onChange={(event) =>
                            setDraft({ ...draft, group: event.target.value as GroupKey })
                        }
                    >
                        {groups.map((group) => (
                            <option key={group} value={group}>
                                {groupLabel(group, design)}
                            </option>
                        ))}
                    </Select>
                </label>
            </div>

            <fieldset className="grid gap-2.5">
                <legend className="text-wed-ink-soft mb-1.5 text-sm">Personnes invitées</legend>
                {draft.guests.map((guest, index) => {
                    const issue = issueAt(issues, `guests.${index}.firstName`);
                    const errorId = `foyer-invite-${index}-erreur`;
                    return (
                        <div
                            key={index}
                            className="grid grid-cols-[1fr_auto_auto] items-start gap-2"
                        >
                            <div>
                                <input
                                    value={guest.firstName}
                                    onChange={(event) =>
                                        setGuest(index, { firstName: event.target.value })
                                    }
                                    placeholder="Prénom"
                                    aria-label={`Prénom de la personne ${index + 1}`}
                                    aria-invalid={Boolean(issue)}
                                    aria-describedby={issue ? errorId : undefined}
                                    className={inputStyles}
                                />
                                <FieldError id={errorId} message={issue && messages[issue.code]} />
                            </div>
                            <label className="text-wed-ink-soft flex min-h-11 cursor-pointer items-center gap-2 px-1 text-sm">
                                <input
                                    type="checkbox"
                                    checked={guest.child}
                                    onChange={(event) =>
                                        setGuest(index, { child: event.target.checked })
                                    }
                                    className="accent-wed-ink size-4.5"
                                />
                                Enfant
                            </label>
                            <button
                                type="button"
                                disabled={draft.guests.length === 1}
                                onClick={() =>
                                    setDraft({
                                        ...draft,
                                        guests: draft.guests.filter((_, at) => at !== index),
                                    })
                                }
                                aria-label={`Retirer la personne ${index + 1}`}
                                className={cn(iconButton, "disabled:invisible")}
                            >
                                <X aria-hidden="true" />
                            </button>
                        </div>
                    );
                })}
                {draft.guests.length < MAX_GUESTS && (
                    <button
                        type="button"
                        onClick={() =>
                            setDraft({
                                ...draft,
                                guests: [...draft.guests, { firstName: "", child: false }],
                            })
                        }
                        className={cn(buttonStyles.quiet, "justify-self-start")}
                    >
                        <Plus aria-hidden="true" />
                        Ajouter une personne
                    </button>
                )}
            </fieldset>

            <fieldset
                aria-describedby={momentIssue ? "foyer-moments-erreur" : undefined}
                className="grid gap-1"
            >
                <legend className="text-wed-ink-soft mb-1.5 text-sm">Invités à</legend>
                {moments.map((moment) => (
                    <label
                        key={moment.key}
                        className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"
                    >
                        <input
                            type="checkbox"
                            checked={draft.momentKeys.includes(moment.key)}
                            onChange={(event) => toggleMoment(moment.key, event.target.checked)}
                            className="accent-wed-ink size-4.5"
                        />
                        {moment.title}
                    </label>
                ))}
                <FieldError
                    id="foyer-moments-erreur"
                    message={momentIssue && messages[momentIssue.code]}
                />
            </fieldset>

            <label className="grid gap-1.5 text-sm">
                <span className="text-wed-ink-soft">
                    E-mail{" "}
                    <small className="text-wed-muted">
                        (facultatif, pour le lien et les relances)
                    </small>
                </span>
                <input
                    type="email"
                    value={draft.email}
                    onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                    autoComplete="off"
                    aria-invalid={Boolean(emailIssue)}
                    aria-describedby={emailIssue ? "foyer-email-erreur" : undefined}
                    className={inputStyles}
                />
                <FieldError
                    id="foyer-email-erreur"
                    message={emailIssue && messages[emailIssue.code]}
                />
            </label>

            <button type="submit" className={cn(buttonStyles.primary, "min-h-12 w-full")}>
                Créer le faire-part
            </button>
        </form>
    );
};

const DialogBody = ({
    moments,
    design,
    linkFor,
    onCreate,
}: Omit<HouseholdDialogProps, "open" | "onOpenChange">) => {
    const [created, setCreated] = useState<HouseholdRecord | null>(null);
    const [round, setRound] = useState(0);

    useScrollLock();

    return created ? (
        <CreatedPanel
            household={created}
            link={linkFor(created)}
            onAnother={() => {
                setCreated(null);
                setRound((current) => current + 1);
            }}
        />
    ) : (
        <HouseholdForm
            key={round}
            moments={moments}
            design={design}
            onCreate={(household) => {
                onCreate(household);
                setCreated(household);
            }}
        />
    );
};

/** « Créer un faire-part »: one household, one personal link, ready to send. */
export const HouseholdDialog = ({ open, onOpenChange, ...body }: HouseholdDialogProps) => (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
            <Dialog.Overlay className="bg-wed-night/55 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50" />
            <Dialog.Content
                data-lenis-prevent
                /* Portalled outside the page: it brings its own display font. */
                className={`${cormorant.variable} bg-wed-paper text-wed-ink font-main data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] motion-reduce:animate-none sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[min(36rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:p-7`}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <Dialog.Title className="font-wed-serif text-3xl leading-tight font-medium">
                            Nouveau faire-part
                        </Dialog.Title>
                        <Dialog.Description className="text-wed-muted mt-1 text-sm">
                            Un foyer, une invitation, un lien personnel.
                        </Dialog.Description>
                    </div>
                    <Dialog.Close aria-label="Fermer" className={iconButton}>
                        <X aria-hidden="true" />
                    </Dialog.Close>
                </div>
                {open && <DialogBody {...body} />}
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);
