"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    CONTENT_WEDDING_DAY,
    defaultDesign,
    DEMO_GUEST_HOUSEHOLD,
    demoSeed,
} from "@/content/wedding-dashboard-demo";
import { weddingDemo } from "@/content/wedding-demo";
import { useLenis } from "lenis/react";
import { AnimatePresence } from "motion/react";

import { moveToDay, weddingCalendar } from "@/lib/wedding-dashboard/calendar";
import { monogram, personalize } from "@/lib/wedding-dashboard/drafts";
import { answerDraftOf } from "@/lib/wedding-dashboard/households";
import { momentsFromPlans } from "@/lib/wedding-dashboard/programme-plan";
import { householdTables } from "@/lib/wedding-dashboard/seating";
import type { HouseholdRecord } from "@/lib/wedding-dashboard/types";
import type { AnswerDraft } from "@/lib/wedding/answer";
import { signPhoto } from "@/lib/wedding/photo-signature";
import { programmeAt } from "@/lib/wedding/programme";
import { siteModeAt } from "@/lib/wedding/site-mode";
import { useWeddingDemo } from "@/hooks/use-wedding-demo";

import { AnswerForm } from "./answer-form";
import { DayPanel } from "./day-panel";
import { DemoDressCode } from "./demo-dress-code";
import { DemoFaq } from "./demo-faq";
import { DemoGallery } from "./demo-gallery";
import { DemoHeading } from "./demo-heading";
import { DemoHero } from "./demo-hero";
import { DemoNav } from "./demo-nav";
import { DemoPlaces } from "./demo-places";
import { DemoProgramme } from "./demo-programme";
import { DemoStory } from "./demo-story";
import { DemoTabBar } from "./demo-tab-bar";
import { InvitationOverlay } from "./invitation-overlay";
import { UploadSheet } from "./upload-sheet";

/** The page behind a personal link the couple removed from their list. */
const ExpiredLink = ({ couple }: { couple: string }) => (
    <main className="mx-auto grid min-h-dvh max-w-120 content-center gap-3 px-4 text-center">
        <p className="font-demo-script text-5xl">{couple}</p>
        <h1 className="font-demo-serif text-3xl font-normal">Ce lien n&apos;est plus valide</h1>
        <p className="text-demo-ink-2">
            Il a peut-être été remplacé. Demandez votre lien personnel aux mariés.
        </p>
    </main>
);

/** The answer card, brought into view under the 64 px nav once an answer is sent. */
const ANSWER_CARD = "rsvp-answer";
const ANSWER_OFFSET = 80;

/** Marie & Thomas as the server renders them, before the visitor's browser copy is read. */
const fallback = demoSeed(new Date(0));
const [fallbackHousehold] = fallback.households;

const presenceLabels = (household: HouseholdRecord) =>
    Object.fromEntries(
        household.guests.map((guest) => [guest.id, guest.labels ?? { yes: "Oui", no: "Non" }]),
    );

/** Marie Lefèvre signs Marie & Thomas's photos; other households sign with their name. */
const signatureOf = (household: HouseholdRecord) =>
    signPhoto({
        householdName:
            household.id === DEMO_GUEST_HOUSEHOLD
                ? weddingDemo.household.signature
                : household.name,
        typedName: { firstName: "", lastName: "" },
    });

/**
 * Camille & Hugo's site as one household sees it through its personal link: Marie & Thomas
 * by default, `?foyer=` for a household created in the couple's dashboard. Answers, visits
 * and the faire-part's wording come from the demo copy kept in this browser.
 * `?skip` skips the faire-part, `?jourj` opens the wedding-day preview.
 */
type DemoSiteProps = {
    /** `?skip`: straight to the site, without the faire-part. */
    skipInvitation: boolean;
    /** `?jourj`: open on the wedding-day preview. */
    startOnWeddingDay: boolean;
    /** `?foyer=`: the household whose personal link this is. */
    householdId?: string;
    /** `?apercu`: opened by the couple from their dashboard, not by the household. */
    preview?: boolean;
};

export const DemoSite = ({
    skipInvitation,
    startOnWeddingDay,
    householdId,
    preview = false,
}: DemoSiteProps) => {
    const { state, dispatch } = useWeddingDemo();
    const [opened, setOpened] = useState(skipInvitation || startOnWeddingDay);
    const [previewDay, setPreviewDay] = useState(startOnWeddingDay);
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const openUpload = useCallback(() => setUploading(true), []);
    const closeUpload = useCallback(() => setUploading(false), []);
    const lenis = useLenis();

    const design = state?.design ?? defaultDesign;
    const household =
        state?.households.find((candidate) => candidate.id === householdId) ??
        state?.households.find((candidate) => candidate.id === DEMO_GUEST_HOUSEHOLD) ??
        fallbackHousehold;
    /** A created household is only known once the browser copy is read. */
    const guestName = state === null && householdId ? null : household.name;

    const calendar = weddingCalendar(design.date, (state ?? fallback).dates);
    const moved = (iso: string) => moveToDay(iso, CONTENT_WEDDING_DAY, design.date);
    /** The programme, questions and room plan as the couple last saved them. */
    const plan = state ?? fallback;
    const invitedMoments = momentsFromPlans(plan.moments, design.date).filter((moment) =>
        household.momentKeys.includes(moment.key),
    );
    const mode = previewDay
        ? "day"
        : siteModeAt({ startsAt: moved(weddingDemo.day.startsAt) }, new Date());
    const programme = programmeAt(
        invitedMoments,
        mode === "day" ? new Date(moved(weddingDemo.dayPreviewAt)) : new Date(),
    );
    const photoSignature = signatureOf(household);

    /** Read when the faire-part closes, so a change elsewhere never restarts its timers. */
    const visit = useRef({ householdId: household.id, counted: state !== null && !preview });
    useEffect(() => {
        visit.current = { householdId: household.id, counted: state !== null && !preview };
    });

    /**
     * The faire-part starts the visit at the top, even when a reload restored an older scroll
     * position underneath it. Lenis is still stopped by the faire-part, hence `force`.
     */
    const markOpened = useCallback(() => {
        if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
        else window.scrollTo(0, 0);
        setOpened(true);
        /** The couple's own preview is not the household's visit. */
        if (visit.current.counted)
            dispatch({
                type: "household-opened",
                householdId: visit.current.householdId,
                at: new Date().toISOString(),
            });
    }, [lenis, dispatch]);

    /**
     * Counts the answers sent. The long form gives way to a short thank-you: without this, the
     * page would stay where the send button was, below the thanks, and focus would be lost.
     */
    const [sent, setSent] = useState(0);
    useEffect(() => {
        if (sent === 0) return;
        const card = document.getElementById(ANSWER_CARD);
        if (!card) return;
        card.focus({ preventScroll: true });
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (lenis) lenis.scrollTo(card, { offset: -ANSWER_OFFSET, immediate: still });
        else card.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" });
    }, [sent, lenis]);

    const submitAnswer = (draft: AnswerDraft) => {
        dispatch({
            type: "answer-recorded",
            householdId: household.id,
            draft,
            at: new Date().toISOString(),
            by: preview ? "maries" : "invite",
        });
        setEditing(false);
        setSent((count) => count + 1);
    };

    const answered = household.answeredAt !== null;

    /** A link the couple took back: it shows nobody else's invitation instead. */
    if (householdId && state && !state.households.some((candidate) => candidate.id === householdId))
        return <ExpiredLink couple={`${design.first} & ${design.second}`} />;

    /** Opened first, before the site: shown alike while the browser copy is read. */
    const overlay = (
        <AnimatePresence>
            {!opened && (
                <InvitationOverlay
                    key="faire-part"
                    guestName={guestName}
                    first={design.first}
                    second={design.second}
                    dateLabel={`${calendar.dateLabel} · ${design.place}`}
                    tone={design.tone}
                    onOpened={markOpened}
                />
            )}
        </AnimatePresence>
    );

    /**
     * Until the browser copy is read, a personal link cannot be told from one the couple took
     * back: nothing of another household is rendered meanwhile, not even under the faire-part.
     */
    if (householdId && state === null)
        return (
            <>
                {overlay}
                <main aria-busy="true" className="min-h-dvh">
                    <p className="sr-only">Chargement de votre invitation…</p>
                </main>
            </>
        );

    return (
        <>
            {overlay}
            {preview && (
                <p
                    role="note"
                    className="bg-demo-ink text-demo-paper px-4 py-2.5 text-center text-sm"
                >
                    <strong className="font-medium">Aperçu des mariés.</strong> Cette visite
                    n&apos;est pas comptée, et une réponse envoyée ici est enregistrée comme saisie
                    par vous.{" "}
                    <Link
                        href={`/mariage/demo/tableau-de-bord/invites?foyer=${encodeURIComponent(household.id)}`}
                        className="font-medium underline underline-offset-4"
                    >
                        Corriger ce foyer
                    </Link>
                </p>
            )}
            <DemoNav
                monogram={monogram(design.first, design.second)}
                mode={mode}
                onTogglePreview={() => {
                    setPreviewDay((day) => !day);
                    lenis?.scrollTo(0, { immediate: true });
                }}
            />
            <main id="top" className="pb-24 md:pb-0">
                {mode === "day" ? (
                    <DayPanel
                        dateLabel={calendar.shortDateLabel}
                        guestName={household.name}
                        tables={plan.tables}
                        room={plan.room}
                        ownTables={householdTables(household, plan.tables, plan.seats)}
                        programme={programme}
                        photoCount={weddingDemo.gallery.count}
                        onAddPhotos={openUpload}
                    />
                ) : (
                    <DemoHero
                        first={design.first}
                        second={design.second}
                        dateLabel={calendar.dateLabel}
                        venue={weddingDemo.venue}
                        welcome={personalize(design.welcome, household.name)}
                        ceremonyAt={moved(weddingDemo.ceremonyAt)}
                        photo={weddingDemo.heroPhoto}
                        revealed={opened}
                    />
                )}
                <DemoStory story={weddingDemo.story} />
                <DemoProgramme programme={programme} mode={mode} />
                <DemoPlaces places={weddingDemo.places} />
                <DemoDressCode dressCode={weddingDemo.dressCode} photo={weddingDemo.dressPhoto} />
                {mode === "before" && (
                    <section
                        id="rsvp"
                        aria-labelledby="rsvp-titre"
                        className="scroll-mt-16 py-20 md:py-30"
                    >
                        <div className="mx-auto grid max-w-310 items-start gap-8 px-4 md:grid-cols-[5fr_7fr] md:gap-18 md:px-7">
                            <div>
                                <DemoHeading
                                    id="rsvp-titre"
                                    number="05"
                                    label="Réponse"
                                    heading={{
                                        text: "Serez-vous des nôtres ?",
                                        emphasis: "des nôtres ?",
                                    }}
                                />
                                <p className="text-demo-ink-2 mt-5 max-w-[40ch]">
                                    Une réponse par personne et par moment. Vous pourrez la modifier
                                    avec ce même lien jusqu&apos;à la date limite.
                                </p>
                                <p className="bg-demo-card border-demo-line mt-7 inline-flex gap-2.5 rounded-full border px-5 py-3">
                                    Date limite{" "}
                                    <strong className="font-demo-serif font-medium">
                                        {calendar.answerDeadlineLabel}
                                    </strong>
                                </p>
                            </div>
                            <div
                                id={ANSWER_CARD}
                                tabIndex={-1}
                                className="bg-demo-card border-demo-line border p-5 outline-none md:p-9"
                            >
                                <AnswerForm
                                    key={`${household.id}-${editing}`}
                                    householdName={household.name}
                                    invitation={{
                                        guests: household.guests,
                                        momentKeys: household.momentKeys,
                                    }}
                                    moments={invitedMoments}
                                    questions={plan.questions}
                                    presenceLabels={presenceLabels(household)}
                                    initialDraft={answerDraftOf(household)}
                                    answered={answered && !editing}
                                    onSubmit={submitAnswer}
                                    onEdit={() => setEditing(true)}
                                />
                            </div>
                        </div>
                    </section>
                )}
                <DemoGallery
                    mode={mode}
                    opensLabel={calendar.galleryOpensLabel}
                    count={weddingDemo.gallery.count}
                    photos={
                        state?.photos.filter((photo) => !photo.removed) ??
                        weddingDemo.gallery.photos
                    }
                    onAddPhotos={openUpload}
                />
                <DemoFaq items={weddingDemo.faq} />
            </main>
            <footer className="border-demo-line border-t px-4 pt-20 pb-28 text-center md:pb-10">
                <p className="font-demo-script text-5xl">
                    {design.first} &amp; {design.second}
                </p>
                <p className="text-demo-muted mt-2.5 text-sm">Nous avons hâte de vous voir.</p>
                <p className="text-demo-muted mt-10 flex flex-wrap justify-center gap-4.5 text-[0.8rem]">
                    <span>Vos données restent en Europe et sont supprimées après le mariage</span>
                    <Link
                        href="/mariage/demo/tableau-de-bord"
                        className="inline-flex min-h-11 items-center underline underline-offset-4"
                    >
                        Côté mariés : le tableau de bord
                    </Link>
                    <Link
                        href="/mariage"
                        className="inline-flex min-h-11 items-center underline underline-offset-4"
                    >
                        Site conçu par AlexDevLab
                    </Link>
                    <span>Photos : Pexels</span>
                </p>
            </footer>
            <DemoTabBar mode={mode} answered={answered} onAddPhotos={openUpload} />
            {uploading && photoSignature.ok && (
                <UploadSheet signature={photoSignature.value} onClose={closeUpload} />
            )}
        </>
    );
};
