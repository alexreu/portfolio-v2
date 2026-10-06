"use client";

import { useEffect, useState } from "react";
import { DEMO_GUEST_HOUSEHOLD } from "@/content/wedding-dashboard-demo";
import { weddingDemo } from "@/content/wedding-demo";
import { useLenis } from "lenis/react";
import { ExternalLink, RotateCcw } from "lucide-react";

import { weddingCalendar } from "@/lib/wedding-dashboard/calendar";
import { guestListCsv } from "@/lib/wedding-dashboard/csv";
import { householdIdFor, monogram } from "@/lib/wedding-dashboard/drafts";
import { groupLabel, householdStatus } from "@/lib/wedding-dashboard/households";
import { momentsFromPlans } from "@/lib/wedding-dashboard/programme-plan";
import type { HouseholdRecord } from "@/lib/wedding-dashboard/types";
import { useNow } from "@/hooks/use-now";
import { useWeddingDemo } from "@/hooks/use-wedding-demo";

import { ConfirmPopover } from "./confirm-popover";
import { DashboardNav } from "./dashboard-nav";
import { buttonStyles } from "./dashboard-ui";
import { DatesSection } from "./dates-section";
import { FollowUpSection } from "./follow-up-section";
import { GallerySection } from "./gallery-section";
import { HouseholdDialog } from "./household-dialog";
import { HouseholdPanel } from "./household-panel";
import { HouseholdsSection } from "./households-section";
import { InvitationEditor } from "./invitation-editor";
import { OverviewSection } from "./overview-section";
import { ProgrammeSection } from "./programme-section";
import { QuestionsSection } from "./questions-section";
import { SeatingSection } from "./seating-section";

const HIGHLIGHT_MS = 2_500;

const linkFor = (household: HouseholdRecord) =>
    `${window.location.origin}/mariage/demo?foyer=${encodeURIComponent(household.id)}`;

const download = (filename: string, content: string) => {
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const link = Object.assign(document.createElement("a"), { href: url, download: filename });
    link.click();
    URL.revokeObjectURL(url);
};

/** Same frame as the dashboard, so nothing jumps once the browser copy is read. */
const DashboardSkeleton = () => (
    <div
        aria-busy="true"
        className="grid min-h-dvh grid-cols-[minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)]"
    >
        <div className="bg-wed-night hidden lg:block" />
        <div className="bg-wed-night h-14 lg:hidden" />
        <div className="mx-auto grid w-full max-w-[76rem] content-start gap-4 px-4 py-8 md:px-8">
            <p className="sr-only">Chargement du tableau de bord…</p>
            {["h-14 w-72", "h-20", "h-32", "h-72"].map((size) => (
                <div
                    key={size}
                    className={`bg-wed-line-soft rounded-2xl motion-safe:animate-pulse ${size}`}
                />
            ))}
        </div>
    </div>
);

/**
 * Camille & Hugo's dashboard with fictional guests. Every change is kept in this browser
 * only and shared with the guest site, so an answer given there shows up here.
 */
export const DashboardApp = () => {
    const { state, dispatch, reset } = useWeddingDemo();
    const now = useNow();
    const lenis = useLenis();
    const [creating, setCreating] = useState(false);
    const [highlightId, setHighlightId] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);

    useEffect(() => {
        if (!highlightId || creating) return;
        lenis?.scrollTo("#invites", { offset: -80 });
        const timer = window.setTimeout(() => setHighlightId(null), HIGHLIGHT_MS);
        return () => window.clearTimeout(timer);
    }, [highlightId, creating, lenis]);

    if (!state) return <DashboardSkeleton />;

    const { design } = state;
    const calendar = weddingCalendar(design.date, state.dates);
    const moments = momentsFromPlans(state.moments, design.date);
    const sampleGuest =
        state.households.find((household) => household.id === DEMO_GUEST_HOUSEHOLD)?.name ??
        weddingDemo.household.name;
    const reminderGuest =
        state.households.find((household) => householdStatus(household) !== "answered")?.name ??
        sampleGuest;
    const at = () => new Date().toISOString();

    const exportCsv = () =>
        download(
            `${householdIdFor(`invites ${design.first} ${design.second}`, "export")}.csv`,
            guestListCsv(state.households, moments, (group) => groupLabel(group, design)),
        );

    const remind = () => dispatch({ type: "reminder-sent", at: at() });

    const resetDemo = reset;

    return (
        <div className="grid min-h-dvh grid-cols-[minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)]">
            <DashboardNav
                couple={`${design.first} & ${design.second}`}
                monogram={monogram(design.first, design.second)}
                subtitle={`${calendar.dateLabel} · Signature`}
                householdCount={state.households.length}
                onReset={resetDemo}
            />
            <main className="mx-auto grid w-full max-w-[76rem] grid-cols-[minmax(0,1fr)] content-start gap-4 px-4 pt-6 pb-16 md:px-8 md:pt-8">
                <aside
                    aria-label="À propos de cette démo"
                    className="border-wed-line bg-wed-paper/70 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed px-5 py-3 text-sm"
                >
                    <p className="text-wed-ink-soft min-w-0 flex-1 basis-96">
                        <strong className="font-semibold">Démo interactive.</strong> Invités
                        fictifs, données gardées dans ce navigateur, rien n&apos;est envoyé.
                        Répondez comme un invité sur le site : vos chiffres bougent ici.
                    </p>
                    <div className="flex flex-wrap gap-1">
                        <a
                            href="/mariage/demo"
                            target="_blank"
                            rel="noopener"
                            className={buttonStyles.quiet}
                        >
                            <ExternalLink aria-hidden="true" />
                            Site des invités
                        </a>
                        <ConfirmPopover
                            question="Revenir aux données de départ ?"
                            detail="Vos essais dans ce navigateur seront effacés."
                            confirmLabel="Réinitialiser"
                            align="end"
                            onConfirm={resetDemo}
                        >
                            <button type="button" className={buttonStyles.quiet}>
                                <RotateCcw aria-hidden="true" />
                                Réinitialiser
                            </button>
                        </ConfirmPopover>
                    </div>
                </aside>

                <OverviewSection
                    state={state}
                    moments={moments}
                    calendar={calendar}
                    now={now}
                    onAddHousehold={() => setCreating(true)}
                    onExport={exportCsv}
                    onRemind={remind}
                />
                <HouseholdsSection
                    households={state.households}
                    moments={moments}
                    design={design}
                    now={now}
                    highlightId={highlightId}
                    linkFor={linkFor}
                    onAddHousehold={() => setCreating(true)}
                    onOpen={(household) => setDetailId(household.id)}
                />
                <DatesSection
                    day={design.date}
                    dates={state.dates}
                    now={now}
                    onSave={(day, dates) => dispatch({ type: "dates-saved", day, dates, at: at() })}
                />
                <ProgrammeSection
                    moments={state.moments}
                    households={state.households}
                    weddingDay={design.date}
                    onSave={(moment, inviteAll) =>
                        dispatch({ type: "moment-saved", moment, inviteAll, at: at() })
                    }
                    onRemove={(moment) =>
                        dispatch({ type: "moment-removed", key: moment.key, at: at() })
                    }
                />
                <SeatingSection
                    households={state.households}
                    tables={state.tables}
                    seats={state.seats}
                    room={state.room}
                    onSaveRoom={(name, size) => dispatch({ type: "room-saved", name, size })}
                    onMoveFixture={(fixture, x, y) =>
                        dispatch({ type: "fixture-moved", fixture, x, y })
                    }
                    onSaveTable={(table) => dispatch({ type: "table-saved", table })}
                    onMoveTable={(tableId, x, y) =>
                        dispatch({ type: "table-moved", tableId, x, y })
                    }
                    onRemoveTable={(tableId) => dispatch({ type: "table-removed", tableId })}
                    onSeatGuest={(guestId, tableId) =>
                        dispatch({ type: "guest-seated", guestId, tableId })
                    }
                    onSeatHousehold={(householdId, tableId) =>
                        dispatch({ type: "household-seated", householdId, tableId })
                    }
                />
                <InvitationEditor
                    design={design}
                    sampleGuest={sampleGuest}
                    now={now}
                    onSave={(next) => dispatch({ type: "design-saved", design: next, at: at() })}
                />
                <QuestionsSection
                    questions={state.questions}
                    onSave={(questions) =>
                        dispatch({ type: "questions-saved", questions, at: at() })
                    }
                />
                <FollowUpSection
                    state={state}
                    calendar={calendar}
                    now={now}
                    sampleGuest={reminderGuest}
                    onRemind={remind}
                    onOpenHousehold={setDetailId}
                />
                <GallerySection
                    photos={state.photos}
                    opensLabel={calendar.galleryOpensLabel}
                    onToggle={(photo) =>
                        dispatch({ type: "photo-toggled", photoId: photo.id, at: at() })
                    }
                />
            </main>
            <HouseholdPanel
                household={state.households.find((household) => household.id === detailId) ?? null}
                moments={moments}
                questions={state.questions}
                design={design}
                activity={state.activity}
                now={now}
                linkFor={linkFor}
                onClose={() => setDetailId(null)}
            />
            <HouseholdDialog
                open={creating}
                onOpenChange={setCreating}
                moments={moments}
                design={design}
                linkFor={linkFor}
                onCreate={(household) => {
                    dispatch({ type: "household-added", household, at: at() });
                    setHighlightId(household.id);
                }}
            />
        </div>
    );
};
