"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { ExternalLink, RotateCcw } from "lucide-react";

import { weddingCalendar } from "@/lib/wedding-dashboard/calendar";
import { catererSheet } from "@/lib/wedding-dashboard/caterer-sheet";
import { guestListCsv } from "@/lib/wedding-dashboard/csv";
import { householdIdFor, monogram } from "@/lib/wedding-dashboard/drafts";
import { groupLabel } from "@/lib/wedding-dashboard/households";
import { momentsFromPlans } from "@/lib/wedding-dashboard/programme-plan";
import type { HouseholdRecord } from "@/lib/wedding-dashboard/types";
import { useNow } from "@/hooks/use-now";
import { useStoredFlag } from "@/hooks/use-stored-flag";
import { useWeddingDemo } from "@/hooks/use-wedding-demo";

import { ConfirmPopover } from "./confirm-popover";
import { DashboardProvider, type Dashboard } from "./dashboard-context";
import { DashboardNav } from "./dashboard-nav";
import { dashboardHref } from "./dashboard-pages";
import { buttonStyles } from "./dashboard-ui";
import { HouseholdDialog } from "./household-dialog";
import { HouseholdPanel } from "./household-panel";

const HIGHLIGHT_MS = 2_500;
const MENU_FOLDED_KEY = "mariage-demo-menu-replie";
const GUESTS = dashboardHref("invites");

const linkFor = (household: HouseholdRecord) =>
    `${window.location.origin}/mariage/demo?foyer=${encodeURIComponent(household.id)}`;

const download = (filename: string, content: Blob) => {
    const url = URL.createObjectURL(content);
    const link = Object.assign(document.createElement("a"), { href: url, download: filename });
    link.click();
    URL.revokeObjectURL(url);
};

const at = () => new Date().toISOString();

/** Same frame as the dashboard, so nothing jumps once the browser copy is read. */
const DashboardSkeleton = ({ folded }: { folded: boolean }) => (
    <div
        aria-busy="true"
        className="grid min-h-dvh grid-cols-[minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,1fr)]"
    >
        <div className={`bg-wed-night hidden lg:block ${folded ? "w-[4.875rem]" : "w-64"}`} />
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
 * Camille & Hugo's dashboard with fictional guests: the menu, the demo notice, and what any
 * page may open, a household's detail or a new faire-part. Every change is kept in this browser
 * only and shared with the guest site, so an answer given there shows up here.
 */
export const DashboardShell = ({ children }: { children: ReactNode }) => {
    const { state, dispatch, reset } = useWeddingDemo();
    const now = useNow();
    const lenis = useLenis();
    const router = useRouter();
    const pathname = usePathname();
    const [creating, setCreating] = useState(false);
    const [highlightId, setHighlightId] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [menuFolded, setMenuFolded] = useStoredFlag(MENU_FOLDED_KEY);

    /** A faire-part just created: once its dialog closes, the guest list shows it lit up. */
    useEffect(() => {
        if (!highlightId || creating) return;
        if (pathname !== GUESTS) router.push(GUESTS);
        else lenis?.scrollTo("#invites", { offset: -80 });
        const timer = window.setTimeout(() => setHighlightId(null), HIGHLIGHT_MS);
        return () => window.clearTimeout(timer);
    }, [highlightId, creating, pathname, router, lenis]);

    if (!state) return <DashboardSkeleton folded={menuFolded} />;

    const { design } = state;
    const calendar = weddingCalendar(design.date, state.dates);
    const moments = momentsFromPlans(state.moments, design.date);

    const dashboard: Dashboard = {
        state,
        dispatch,
        now,
        calendar,
        moments,
        at,
        linkFor,
        highlightId,
        openHousehold: setDetailId,
        createHousehold: () => setCreating(true),
        exportCsv: () =>
            download(
                `${householdIdFor(`invites ${design.first} ${design.second}`, "export")}.csv`,
                new Blob(
                    [guestListCsv(state.households, moments, (group) => groupLabel(group, design))],
                    { type: "text/csv;charset=utf-8" },
                ),
            ),
        exportCatererPdf: async () => {
            /** Only loaded when asked for: the PDF library stays out of the page. */
            const { catererPdf } = await import("@/lib/wedding-dashboard/caterer-pdf");
            const sheet = catererSheet(state, calendar, new Date());
            const bytes = await catererPdf(sheet);
            download(
                sheet.filename,
                new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
            );
        },
        remind: () => dispatch({ type: "reminder-sent", at: at() }),
    };

    return (
        <DashboardProvider value={dashboard}>
            <div className="grid min-h-dvh grid-cols-[minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,1fr)]">
                <DashboardNav
                    couple={`${design.first} & ${design.second}`}
                    monogram={monogram(design.first, design.second)}
                    subtitle={`${calendar.dateLabel} · Signature`}
                    householdCount={state.households.length}
                    folded={menuFolded}
                    onFold={setMenuFolded}
                    onReset={reset}
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
                                onConfirm={reset}
                            >
                                <button type="button" className={buttonStyles.quiet}>
                                    <RotateCcw aria-hidden="true" />
                                    Réinitialiser
                                </button>
                            </ConfirmPopover>
                        </div>
                    </aside>
                    {children}
                </main>
                <HouseholdPanel
                    household={
                        state.households.find((household) => household.id === detailId) ?? null
                    }
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
        </DashboardProvider>
    );
};
