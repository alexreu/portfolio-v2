"use client";

import { useState, useSyncExternalStore } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, ExternalLink, Music, X } from "lucide-react";
import {
    AnimatePresence,
    motion,
    MotionConfig,
    type Transition,
    type Variants,
} from "motion/react";

import { dateTimeLabel, sinceLabel } from "@/lib/wedding-dashboard/calendar";
import {
    groupLabel,
    guestAnswers,
    householdStatus,
    householdSummary,
    householdTimeline,
    type CellTone,
    type GuestAnswer,
} from "@/lib/wedding-dashboard/households";
import type { Activity, HouseholdRecord, InvitationDesign } from "@/lib/wedding-dashboard/types";
import type { GuestQuestion, Moment } from "@/lib/wedding/types";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { cormorant } from "@/app/fonts/wedding";

import { buttonStyles, Chip, iconButton } from "./dashboard-ui";

type HouseholdPanelProps = {
    /** The household shown, null when the panel is closed. */
    household: HouseholdRecord | null;
    moments: readonly Moment[];
    questions: readonly GuestQuestion[];
    design: InvitationDesign;
    activity: readonly Activity[];
    now: Date;
    linkFor: (household: HouseholdRecord) => string;
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

const StatusLine = ({ household, now }: { household: HouseholdRecord; now: Date }) => {
    const status = householdStatus(household);
    if (status === "answered" && household.answeredAt)
        return (
            <Chip tone="yes">
                {household.answeredBy === "maries" ? "Réponse papier" : "Répondu"} ·{" "}
                {dateTimeLabel(household.answeredAt)}
            </Chip>
        );
    if (status === "opened" && household.lastSeenAt)
        return (
            <Chip tone="wait">
                Lien ouvert {sinceLabel(household.lastSeenAt, now)}, sans réponse
            </Chip>
        );
    return <Chip tone="closed">Lien jamais ouvert</Chip>;
};

const PanelBody = ({
    household,
    moments,
    questions,
    design,
    activity,
    now,
    linkFor,
}: Omit<HouseholdPanelProps, "household" | "onClose"> & { household: HouseholdRecord }) => {
    const [copied, setCopied] = useState(false);
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

    return (
        <motion.div variants={cascade} initial="hidden" animate="shown" className="grid gap-7">
            <motion.div variants={rise} className="grid justify-items-start gap-3">
                <StatusLine household={household} now={now} />
                <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={copy} className={buttonStyles.secondary}>
                        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                        {copied ? "Lien copié" : "Copier son lien"}
                    </button>
                    <a
                        href={linkFor(household)}
                        target="_blank"
                        rel="noopener"
                        className={buttonStyles.quiet}
                    >
                        <ExternalLink aria-hidden="true" />
                        Son faire-part
                    </a>
                </div>
            </motion.div>

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
                            {guest.diet && (
                                <p className="text-wed-ink-soft text-sm">
                                    <span className="text-wed-muted">Régime :</span> {guest.diet}
                                </p>
                            )}
                        </motion.li>
                    ))}
                </motion.ul>
            </motion.section>

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
                                        {answered ? "Pas de réponse" : "En attente de leur réponse"}
                                    </span>
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>
            </motion.section>

            <motion.section variants={rise} aria-labelledby="detail-mot">
                <h3 id="detail-mot" className={heading}>
                    Leur mot
                </h3>
                {household.message ? (
                    <blockquote className="border-wed-gold-soft border-l-2 pl-4">
                        <motion.p
                            variants={ink}
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
                                {dateTimeLabel(entry.at)}
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
                                            <Dialog.Title className="font-wed-serif text-3xl leading-tight font-medium">
                                                {shown.name}
                                            </Dialog.Title>
                                            <Dialog.Description className="text-wed-muted mt-1 text-sm">
                                                {householdSummary(shown)} ·{" "}
                                                {groupLabel(shown.group, body.design)}
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
