"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
    dateTimeLabel,
    draftOf,
    groupLabel,
    guestAnswers,
    householdStatus,
    householdSummary,
    householdTimeline,
    previewOf,
    sinceLabel,
    type Activity,
    type AnswerDraft,
    type CellTone,
    type GuestAnswer,
    type GuestQuestion,
    type HouseholdDraft,
    type HouseholdGroup,
    type HouseholdRecord,
    type InvitationDesign,
    type Moment,
} from "@alexreu/wedding-core";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, ExternalLink, Music, PenLine, Trash2, UserPen, X } from "lucide-react";
import {
    AnimatePresence,
    motion,
    MotionConfig,
    useReducedMotion,
    type Transition,
    type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { cormorant } from "@/app/fonts/wedding";

import { ConfirmPopover } from "./confirm-popover";
import { buttonStyles, Chip, iconButton, PlanBadge } from "./dashboard-ui";
import { HouseholdForm } from "./household-dialog";
import { PaperAnswerForm } from "./paper-answer-form";
import { PdfButton } from "./pdf-button";
import { QrImage } from "./qr-image";

type HouseholdPanelProps = {
    /** The household shown, null when the panel is closed. */
    household: HouseholdRecord | null;
    moments: readonly Moment[];
    questions: readonly GuestQuestion[];
    design: InvitationDesign;
    /** Where the wedding takes place: answers are dated there. */
    timezone: string;
    groups: readonly HouseholdGroup[];
    activity: readonly Activity[];
    now: Date;
    linkFor: (household: HouseholdRecord) => string;
    /** The household's own printed faire-part, with its personal QR code. */
    onDownloadInvitation: (household: HouseholdRecord) => Promise<void>;
    /** The household corrected: name, people, moments, e-mail. */
    onEdit: (household: HouseholdRecord, draft: HouseholdDraft) => void;
    /** An answer received by post or by phone, typed in by the couple. */
    onAnswer: (household: HouseholdRecord, draft: AnswerDraft) => void;
    onRemove: (household: HouseholdRecord) => void;
    /** What the person looking may do here; the couple may do it all. */
    allowed: {
        readonly edit: boolean;
        readonly answer: boolean;
        readonly remove: boolean;
        readonly print: boolean;
        readonly diets: boolean;
    };
    onClose: () => void;
};

const presenceTone: Record<GuestAnswer["moments"][number]["presence"], CellTone> = {
    yes: "yes",
    no: "no",
    pending: "wait",
};

const heading = "text-wed-muted mb-3 text-xs font-medium tracking-wide uppercase";

const settle = [0.22, 1, 0.36, 1] as const;

/** The panel springs in, and leaves faster than it came. */
const slideIn: Transition = { type: "spring", stiffness: 320, damping: 34, mass: 0.9 };
const slideOut: Transition = { duration: 0.22, ease: [0.4, 0, 1, 1] };

/** Blocks arrive one after the other once the panel is nearly in place. */
const cascade: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

const rise: Variants = {
    hidden: { opacity: 0, y: 14 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: settle } },
};

const guests: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.06 } },
};

const chip: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    shown: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 500, damping: 26, delay: 0.15 },
    },
};

/** The note is written in ink, left to right, like the names on the site. */
const ink: Variants = {
    hidden: { clipPath: "inset(0% 100% 0% 0%)" },
    shown: {
        clipPath: "inset(0% 0% 0% 0%)",
        transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.1 },
    },
};

/** The history's thread is drawn from the top, then each step appears on it. */
const thread: Variants = {
    hidden: { scaleY: 0 },
    shown: {
        scaleY: 1,
        transition: { duration: 0.6, ease: settle, staggerChildren: 0.08, delayChildren: 0.2 },
    },
};

const step: Variants = {
    hidden: { opacity: 0, x: -6 },
    shown: { opacity: 1, x: 0, transition: { duration: 0.35, ease: settle } },
};

const WIDE = "(min-width: 640px)";

/** Side panel from the right on a wide screen, bottom sheet on a phone. */
const useWideScreen = () =>
    useSyncExternalStore(
        (onChange) => {
            const query = window.matchMedia(WIDE);
            query.addEventListener("change", onChange);
            return () => query.removeEventListener("change", onChange);
        },
        () => window.matchMedia(WIDE).matches,
        () => true,
    );

const StatusLine = ({
    household,
    now,
    timezone,
}: {
    household: HouseholdRecord;
    now: Date;
    timezone: string;
}) => {
    const status = householdStatus(household);
    if (status === "incomplete")
        return (
            <Chip tone="wait">Réponse à compléter · un moment ou une personne ajouté depuis</Chip>
        );
    if (status === "answered" && household.answeredAt)
        return (
            <Chip tone="yes">
                {household.answeredBy === "couple" ? "Réponse papier" : "Répondu"} ·{" "}
                {dateTimeLabel(household.answeredAt, timezone)}
            </Chip>
        );
    if (status === "opened" && household.lastSeenAt)
        return (
            <Chip tone="wait">
                Lien ouvert {sinceLabel(household.lastSeenAt, now, timezone)}, sans réponse
            </Chip>
        );
    return <Chip tone="closed">Lien jamais ouvert</Chip>;
};

const PanelBody = ({
    household,
    moments,
    questions,
    design,
    timezone,
    groups,
    activity,
    now,
    linkFor,
    onDownloadInvitation,
    onEdit,
    onAnswer,
    onRemove,
    allowed,
}: Omit<HouseholdPanelProps, "household" | "onClose"> & { household: HouseholdRecord }) => {
    const [copied, setCopied] = useState(false);
    /** The detail, or one of the forms that correct it, in the same panel. */
    const [view, setView] = useState<"detail" | "edit" | "answer">("detail");
    /** Said once a form is saved, back on the detail. */
    const [saved, setSaved] = useState("");
    const top = useRef<HTMLDivElement>(null);
    const title = useRef<HTMLHeadingElement>(null);
    const still = useReducedMotion() ?? false;

    /** The button that opened a view is gone: its title takes the focus instead. */
    useEffect(() => {
        if (view !== "detail") title.current?.focus();
    }, [view]);

    /** Escape leaves a form for the detail, not the whole panel with what was typed. */
    useEffect(() => {
        if (view === "detail") return;
        const back = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            event.stopPropagation();
            setView("detail");
        };
        window.addEventListener("keydown", back, true);
        return () => window.removeEventListener("keydown", back, true);
    }, [view]);
    const answered = household.answeredAt !== null;
    const timeline = householdTimeline(household, activity, design.first);

    useScrollLock();

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(linkFor(household));
            setCopied(true);
        } catch {
            window.prompt("Copiez le lien personnel :", linkFor(household));
        }
    };

    /** Each view starts at the top of the panel, its first field in reach. */
    const show = (next: typeof view, message = "") => {
        setView(next);
        setSaved(message);
        top.current?.closest("[data-lenis-prevent]")?.scrollTo({ top: 0 });
    };

    if (view !== "detail")
        return (
            <section ref={top} aria-labelledby="detail-formulaire" className="grid gap-5">
                <h3
                    id="detail-formulaire"
                    ref={title}
                    tabIndex={-1}
                    className="font-wed-serif text-2xl font-medium outline-none"
                >
                    {view === "edit"
                        ? "Modifier le foyer"
                        : answered
                          ? "Modifier sa réponse"
                          : "Saisir sa réponse"}
                </h3>
                {view === "edit" ? (
                    <>
                        <p className="text-wed-muted text-sm">
                            Son lien reste le même. Une personne ou un moment retiré emporte sa
                            réponse et sa place à table.
                        </p>
                        <HouseholdForm
                            moments={moments}
                            groups={groups}
                            initial={draftOf(household)}
                            label={`Modifier ${household.name}`}
                            submitLabel="Enregistrer le foyer"
                            onSubmit={(draft) => {
                                onEdit(household, draft);
                                show("detail", "Foyer enregistré.");
                            }}
                            onCancel={() => show("detail")}
                        />
                    </>
                ) : (
                    <>
                        <p className="text-wed-muted text-sm">
                            Une réponse reçue par courrier ou par téléphone. Elle apparaîtra comme
                            saisie par {design.first}.
                        </p>
                        <PaperAnswerForm
                            household={household}
                            moments={moments.filter((moment) =>
                                household.momentKeys.includes(moment.key),
                            )}
                            questions={questions}
                            onSubmit={(draft) => {
                                onAnswer(household, draft);
                                show("detail", "Réponse enregistrée.");
                            }}
                            onCancel={() => show("detail")}
                        />
                    </>
                )}
            </section>
        );

    return (
        <motion.div
            ref={top}
            variants={cascade}
            initial="hidden"
            animate="shown"
            className="grid gap-7"
        >
            <motion.div variants={rise} className="grid justify-items-start gap-3">
                <StatusLine household={household} now={now} timezone={timezone} />
                <p
                    role="status"
                    className="text-wed-yes flex items-center gap-1.5 text-sm empty:hidden"
                >
                    {saved && (
                        <>
                            <Check aria-hidden="true" className="size-4" />
                            {saved}
                        </>
                    )}
                </p>
                <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={copy} className={buttonStyles.secondary}>
                        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                        {copied ? "Lien copié" : "Copier son lien"}
                    </button>
                    <a
                        href={previewOf(linkFor(household))}
                        target="_blank"
                        rel="noopener"
                        className={buttonStyles.quiet}
                    >
                        <ExternalLink aria-hidden="true" />
                        Son faire-part
                    </a>
                </div>
                {(allowed.answer || allowed.edit || allowed.remove) && (
                    <div className="border-wed-line-soft flex w-full flex-wrap gap-2 border-t pt-3">
                        {allowed.answer && (
                            <button
                                type="button"
                                onClick={() => show("answer")}
                                className={buttonStyles.secondary}
                            >
                                <PenLine aria-hidden="true" />
                                {answered ? "Modifier sa réponse" : "Saisir sa réponse"}
                            </button>
                        )}
                        {allowed.edit && (
                            <button
                                type="button"
                                onClick={() => show("edit")}
                                className={buttonStyles.quiet}
                            >
                                <UserPen aria-hidden="true" />
                                Modifier le foyer
                            </button>
                        )}
                        {allowed.remove && (
                            <ConfirmPopover
                                question={`Retirer ${household.name} ?`}
                                detail="Son lien personnel ne fonctionnera plus. Sa réponse et ses places à table sont effacées."
                                confirmLabel="Retirer le foyer"
                                align="end"
                                onConfirm={() => onRemove(household)}
                            >
                                <button
                                    type="button"
                                    className={cn(
                                        buttonStyles.quiet,
                                        "text-wed-no hover:text-wed-no",
                                    )}
                                >
                                    <Trash2 aria-hidden="true" />
                                    Retirer
                                </button>
                            </ConfirmPopover>
                        )}
                    </div>
                )}
            </motion.div>

            {allowed.print && (
                <motion.section variants={rise} aria-labelledby="detail-papier">
                    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <h3 id="detail-papier" className={cn(heading, "mb-0")}>
                            Son faire-part papier
                        </h3>
                        <PlanBadge flag="household-qr" />
                    </div>
                    <div className="border-wed-line-soft flex items-center gap-4 rounded-2xl border p-3">
                        <QrImage
                            url={linkFor(household)}
                            label={`QR code personnel de ${household.name}`}
                            className="size-24 shrink-0"
                        />
                        <div className="grid justify-items-start gap-2">
                            <p className="text-wed-ink-soft text-sm">
                                Imprimé sur son faire-part, ce code ouvre sa réponse sans rien
                                taper, et le jour J, sa table.
                            </p>
                            <PdfButton
                                onExport={() => onDownloadInvitation(household)}
                                className="min-h-9 px-3.5 text-[0.8rem]"
                            >
                                Son faire-part PDF
                            </PdfButton>
                        </div>
                    </div>
                </motion.section>
            )}

            <motion.section variants={rise} aria-labelledby="detail-qui">
                <h3 id="detail-qui" className={heading}>
                    Qui vient
                </h3>
                <motion.ul
                    variants={guests}
                    className="divide-wed-line-soft border-wed-line-soft divide-y rounded-2xl border"
                >
                    {guestAnswers(household, moments).map((guest) => (
                        <motion.li
                            key={guest.id}
                            variants={rise}
                            className="grid gap-2 px-4 py-3.5"
                        >
                            <p className="flex items-center gap-2 font-medium">
                                {guest.firstName}
                                {guest.child && (
                                    <span className="border-wed-line text-wed-muted rounded-md border px-1.5 text-[0.7rem] font-normal">
                                        enfant
                                    </span>
                                )}
                            </p>
                            <ul className="grid gap-1.5 text-sm">
                                {guest.moments.map((moment) => (
                                    <li
                                        key={moment.key}
                                        className="flex items-center justify-between gap-3"
                                    >
                                        <span className="text-wed-ink-soft">{moment.title}</span>
                                        <motion.span variants={chip} className="inline-flex">
                                            <Chip tone={presenceTone[moment.presence]}>
                                                {moment.label}
                                            </Chip>
                                        </motion.span>
                                    </li>
                                ))}
                            </ul>
                            {allowed.diets && guest.diet && (
                                <p className="text-wed-ink-soft text-sm">
                                    <span className="text-wed-muted">Régime :</span> {guest.diet}
                                </p>
                            )}
                        </motion.li>
                    ))}
                </motion.ul>
            </motion.section>

            {questions.length > 0 && (
                <motion.section variants={rise} aria-labelledby="detail-reponses">
                    <h3 id="detail-reponses" className={heading}>
                        Vos questions
                    </h3>
                    <dl className="grid gap-3 text-sm">
                        {questions.map((question) => (
                            <div key={question.id}>
                                <dt className="text-wed-muted">{question.label}</dt>
                                <dd className="mt-0.5 flex items-center gap-2">
                                    {household.questions[question.id] ? (
                                        <>
                                            <Music
                                                aria-hidden="true"
                                                className="text-wed-gold size-4 shrink-0"
                                            />
                                            {household.questions[question.id]}
                                        </>
                                    ) : (
                                        <span className="text-wed-muted italic">
                                            {answered
                                                ? "Pas de réponse"
                                                : "En attente de leur réponse"}
                                        </span>
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </motion.section>
            )}

            <motion.section variants={rise} aria-labelledby="detail-mot">
                <h3 id="detail-mot" className={heading}>
                    Leur mot
                </h3>
                {household.message ? (
                    <blockquote className="border-wed-gold-soft border-l-2 pl-4">
                        <motion.p
                            variants={still ? undefined : ink}
                            className="font-wed-serif text-wed-ink text-xl leading-snug italic"
                        >
                            « {household.message} »
                        </motion.p>
                    </blockquote>
                ) : (
                    <p className="text-wed-muted text-sm italic">
                        {answered ? "Pas de mot cette fois." : "En attente de leur réponse."}
                    </p>
                )}
            </motion.section>

            <motion.section variants={rise} aria-labelledby="detail-historique">
                <h3 id="detail-historique" className={heading}>
                    Historique
                </h3>
                <motion.ol
                    variants={thread}
                    className="border-wed-line ml-1.5 grid origin-top gap-3 border-l pl-4 text-sm"
                >
                    {timeline.map((entry) => (
                        <motion.li
                            key={`${entry.label}-${entry.at}`}
                            variants={step}
                            className="relative"
                        >
                            <span
                                aria-hidden="true"
                                className="border-wed-line bg-wed-paper absolute top-1.5 -left-[1.3rem] size-2 rounded-full border"
                            />
                            {entry.label}
                            <time dateTime={entry.at} className="text-wed-muted block text-xs">
                                {dateTimeLabel(entry.at, timezone)}
                            </time>
                        </motion.li>
                    ))}
                </motion.ol>
            </motion.section>
        </motion.div>
    );
};

/** A household's whole answer: who comes to what, their diets, their answers and their note. */
export const HouseholdPanel = ({ household, onClose, ...body }: HouseholdPanelProps) => {
    const wide = useWideScreen();
    /** Kept while the panel slides out, after the household itself is gone. */
    const [shown, setShown] = useState(household);
    if (household && household !== shown) setShown(household);
    const offscreen = wide ? { x: "100%" } : { y: "100%" };

    return (
        <MotionConfig reducedMotion="user">
            <Dialog.Root open={household !== null} onOpenChange={(open) => !open && onClose()}>
                <AnimatePresence>
                    {household && shown && (
                        <Dialog.Portal forceMount>
                            <Dialog.Overlay asChild forceMount>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { duration: 0.3 } }}
                                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                    className="bg-wed-night/45 fixed inset-0 z-50 backdrop-blur-[2px]"
                                />
                            </Dialog.Overlay>
                            <Dialog.Content asChild forceMount>
                                <motion.div
                                    data-lenis-prevent
                                    initial={offscreen}
                                    animate={{ x: 0, y: 0, transition: slideIn }}
                                    exit={{ ...offscreen, transition: slideOut }}
                                    /* Portalled outside the page: it brings its own display font. */
                                    className={`${cormorant.variable} bg-wed-paper text-wed-ink font-main shadow-wed-night/30 fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-3xl p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[min(30rem,100vw)] sm:rounded-none sm:rounded-l-3xl sm:p-7`}
                                >
                                    {/* Keyed by household: another one replays the entrance. */}
                                    <motion.div
                                        key={`${shown.id}-titre`}
                                        variants={rise}
                                        initial="hidden"
                                        animate="shown"
                                        className="mb-5 flex items-start justify-between gap-4"
                                    >
                                        <div>
                                            <Dialog.Title className="font-wed-serif text-3xl leading-tight font-medium [overflow-wrap:anywhere]">
                                                {shown.name}
                                            </Dialog.Title>
                                            <Dialog.Description className="text-wed-muted mt-1 text-sm">
                                                {householdSummary(shown, {
                                                    diets: body.allowed.diets,
                                                })}{" "}
                                                {groupLabel(body.groups, shown.group) &&
                                                    ` · ${groupLabel(body.groups, shown.group)}`}
                                            </Dialog.Description>
                                        </div>
                                        <Dialog.Close aria-label="Fermer" className={iconButton}>
                                            <X aria-hidden="true" />
                                        </Dialog.Close>
                                    </motion.div>
                                    <PanelBody
                                        key={`${shown.id}-detail`}
                                        household={shown}
                                        {...body}
                                    />
                                </motion.div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    )}
                </AnimatePresence>
            </Dialog.Root>
        </MotionConfig>
    );
};
