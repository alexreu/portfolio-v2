"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { ExternalLink, RotateCcw } from "lucide-react";

import { roleLabel } from "@/lib/wedding-dashboard/access";
import { weddingCalendar } from "@/lib/wedding-dashboard/calendar";
import { catererSheet } from "@/lib/wedding-dashboard/caterer-sheet";
import { guestListCsv } from "@/lib/wedding-dashboard/csv";
import { householdIdFor, monogram } from "@/lib/wedding-dashboard/drafts";
import { galleryArchive } from "@/lib/wedding-dashboard/gallery-archive";
import { groupLabel } from "@/lib/wedding-dashboard/households";
import type { DashboardPage } from "@/lib/wedding-dashboard/pages";
import {
    can,
    canRead,
    canSee,
    COUPLE,
    viewerOf,
    type Viewer,
} from "@/lib/wedding-dashboard/permissions";
import { previewOf } from "@/lib/wedding-dashboard/preview-link";
import {
    galleryPoster,
    householdInvitations,
    seatingPoster,
    sharedInvitation,
} from "@/lib/wedding-dashboard/prints";
import { momentsFromPlans } from "@/lib/wedding-dashboard/programme-plan";
import type { HouseholdRecord } from "@/lib/wedding-dashboard/types";
import { useNow } from "@/hooks/use-now";
import { useStoredFlag } from "@/hooks/use-stored-flag";
import { useWeddingDemo } from "@/hooks/use-wedding-demo";

import { ConfirmPopover } from "./confirm-popover";
import { DashboardProvider, type Dashboard } from "./dashboard-context";
import { DashboardNav, MENU_FOLDED_KEY } from "./dashboard-nav";
import { dashboardEntries, dashboardHref } from "./dashboard-pages";
import { buttonStyles, Select } from "./dashboard-ui";
import { HouseholdDialog } from "./household-dialog";
import { HouseholdPanel } from "./household-panel";

const HIGHLIGHT_MS = 2_500;
const GUESTS = dashboardHref("invites");

const siteUrl = () => `${window.location.origin}/mariage/demo`;

const linkFor = (household: HouseholdRecord) =>
    `${siteUrl()}?foyer=${encodeURIComponent(household.id)}`;

const seatingUrl = () => `${siteUrl()}/plan-de-table`;

const galleryUrl = () => `${siteUrl()}/galerie`;

const dayAfterUrl = () => previewOf(`${siteUrl()}?apres`);

/** The page a path opens, null for the overview. */
const pageAt = (pathname: string): DashboardPage | null =>
    dashboardEntries
        .flatMap((entry) => (entry.page ? [entry.page] : []))
        .find((page) => pathname.replace(/\/$/, "").startsWith(dashboardHref(page))) ?? null;

const download = (filename: string, content: Blob) => {
    const url = URL.createObjectURL(content);
    const link = Object.assign(document.createElement("a"), { href: url, download: filename });
    link.click();
    URL.revokeObjectURL(url);
};

const downloadPdf = (filename: string, bytes: Uint8Array) =>
    download(filename, new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));

/** Only loaded when asked for: the PDF library stays out of the page. */
const printPdf = () => import("@/lib/wedding-dashboard/print-pdf");

const at = () => new Date().toISOString();

/** A page the person looking has no access to: said plainly, with the way back. */
const NoAccess = ({ name, onBack }: { name: string; onBack: () => void }) => (
    <section
        aria-labelledby="sans-acces-titre"
        className="border-wed-line-soft bg-wed-paper grid justify-items-start gap-3 rounded-2xl border p-6"
    >
        <h1 id="sans-acces-titre" className="font-wed-serif text-3xl font-medium">
            {name} n&apos;a pas accès à cette page
        </h1>
        <p className="text-wed-muted text-sm">
            Vous lui avez ouvert d&apos;autres fonctions : elles seules apparaissent dans son menu.
        </p>
        <button type="button" onClick={onBack} className={buttonStyles.secondary}>
            Revenir à votre vue
        </button>
    </section>
);

/** Same frame as the dashboard, so nothing jumps once the browser copy is read. */
const DashboardSkeleton = () => {
    const [folded] = useStoredFlag(MENU_FOLDED_KEY);
    return (
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
};

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
    /** The demo can show the dashboard as someone the couple let in sees it. */
    const [viewerId, setViewerId] = useState<string | null>(null);
    /** The household the guest list was last sent to: once, never again on another page. */
    const sentTo = useRef<string | null>(null);

    /** A faire-part just created: once its dialog closes, the guest list shows it lit up. */
    useEffect(() => {
        if (!highlightId || creating) return;
        if (sentTo.current !== highlightId) {
            sentTo.current = highlightId;
            if (pathname !== GUESTS) return router.push(GUESTS);
        }
        if (pathname === GUESTS) lenis?.scrollTo("#invites", { offset: -80 });
        const timer = window.setTimeout(() => setHighlightId(null), HIGHLIGHT_MS);
        return () => window.clearTimeout(timer);
    }, [highlightId, creating, pathname, router, lenis]);

    if (!state) return <DashboardSkeleton />;

    const { design } = state;
    const calendar = weddingCalendar(design.date, state.dates);
    const moments = momentsFromPlans(state.moments, design.date);
    const looking = state.collaborators.find((collaborator) => collaborator.id === viewerId);
    const viewer: Viewer = looking ? viewerOf(looking.grant) : COUPLE;
    const open = canSee(viewer, pageAt(pathname));

    const startAgain = () => {
        setDetailId(null);
        setViewerId(null);
        reset();
    };

    const dashboard: Dashboard = {
        state,
        viewer,
        can: (action) => can(viewer, action),
        canRead: (feature) => canRead(viewer, feature),
        dispatch,
        now,
        calendar,
        moments,
        at,
        linkFor,
        siteUrl: siteUrl(),
        seatingUrl: seatingUrl(),
        galleryUrl: galleryUrl(),
        highlightId,
        openHousehold: setDetailId,
        createHousehold: () => setCreating(true),
        exportCsv: () =>
            download(
                `${householdIdFor(`invites ${design.first} ${design.second}`, "export")}.csv`,
                new Blob(
                    [
                        guestListCsv(
                            state.households,
                            moments,
                            (group) => groupLabel(group, design),
                            {
                                diets: can(viewer, "diets.read"),
                            },
                        ),
                    ],
                    { type: "text/csv;charset=utf-8" },
                ),
            ),
        exportCatererPdf: async () => {
            /** Only loaded when asked for: the PDF library stays out of the page. */
            const { catererPdf } = await import("@/lib/wedding-dashboard/caterer-pdf");
            const sheet = catererSheet(state, calendar, new Date());
            downloadPdf(sheet.filename, await catererPdf(sheet));
        },
        downloadSharedInvitation: async () => {
            const { invitationPdf } = await printPdf();
            const print = sharedInvitation(design, calendar, siteUrl());
            downloadPdf(print.filename, await invitationPdf(print));
        },
        downloadHouseholdInvitations: async (households = state.households) => {
            const { invitationPdf } = await printPdf();
            const print = householdInvitations(design, calendar, siteUrl(), households, linkFor);
            downloadPdf(print.filename, await invitationPdf(print));
        },
        downloadSeatingPoster: async () => {
            const { posterPdf } = await printPdf();
            const poster = seatingPoster(design, calendar, state.room.name, seatingUrl());
            downloadPdf(poster.filename, await posterPdf(poster));
        },
        dayAfterUrl: dayAfterUrl(),
        downloadGallery: async () => {
            /** Only loaded when asked for, like the PDF library. */
            const { zipSync } = await import("fflate");
            const archive = galleryArchive(design, state.photos);
            const files = await Promise.all(
                archive.files.map(async (file) => {
                    const response = await fetch(file.url);
                    if (!response.ok) throw new Error(`Photo ${file.name}: ${response.status}`);
                    return [file.name, new Uint8Array(await response.arrayBuffer())] as const;
                }),
            );
            /** Photos are compressed already: stored as they are, the archive builds at once. */
            const zipped = zipSync(Object.fromEntries(files), { level: 0 });
            download(
                archive.filename,
                new Blob([new Uint8Array(zipped)], { type: "application/zip" }),
            );
        },
        downloadGalleryPoster: async () => {
            const { posterPdf } = await printPdf();
            const poster = galleryPoster(design, calendar, galleryUrl());
            downloadPdf(poster.filename, await posterPdf(poster));
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
                    canOpen={(entry) => canSee(viewer, entry)}
                    onReset={startAgain}
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
                        <div className="flex flex-wrap items-center gap-1">
                            {state.collaborators.length > 0 && (
                                <label className="text-wed-ink-soft flex items-center gap-2">
                                    <span className="whitespace-nowrap">Voir en tant que</span>
                                    <Select
                                        value={viewerId ?? ""}
                                        onChange={(event) =>
                                            setViewerId(event.target.value || null)
                                        }
                                        wrapperClassName="w-auto"
                                        className="min-h-10 py-0 text-sm"
                                    >
                                        <option value="">Vous deux</option>
                                        {state.collaborators.map((collaborator) => (
                                            <option key={collaborator.id} value={collaborator.id}>
                                                {collaborator.firstName} · {roleLabel(collaborator)}
                                            </option>
                                        ))}
                                    </Select>
                                </label>
                            )}
                            <a
                                href={previewOf("/mariage/demo")}
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
                                onConfirm={startAgain}
                            >
                                <button type="button" className={buttonStyles.quiet}>
                                    <RotateCcw aria-hidden="true" />
                                    Réinitialiser
                                </button>
                            </ConfirmPopover>
                        </div>
                    </aside>
                    {open ? (
                        children
                    ) : (
                        <NoAccess
                            name={looking?.firstName ?? ""}
                            onBack={() => setViewerId(null)}
                        />
                    )}
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
                    allowed={{
                        edit: can(viewer, "household.edit"),
                        answer: can(viewer, "household.answer"),
                        remove: can(viewer, "household.remove"),
                        print: can(viewer, "household.print"),
                        diets: can(viewer, "diets.read"),
                    }}
                    onDownloadInvitation={(household) =>
                        dashboard.downloadHouseholdInvitations([household])
                    }
                    onEdit={(household, draft) =>
                        dispatch({
                            type: "household-edited",
                            householdId: household.id,
                            draft,
                            at: at(),
                        })
                    }
                    onAnswer={(household, draft) =>
                        dispatch({
                            type: "answer-recorded",
                            householdId: household.id,
                            draft,
                            at: at(),
                            by: "maries",
                        })
                    }
                    onRemove={(household) => {
                        setDetailId(null);
                        dispatch({
                            type: "household-removed",
                            householdId: household.id,
                            at: at(),
                        });
                        /** Its row is gone: the list's title holds the focus instead of the page. */
                        window.setTimeout(
                            () => document.getElementById("invites-titre")?.focus(),
                            0,
                        );
                    }}
                    onClose={() => setDetailId(null)}
                />
                <HouseholdDialog
                    takenIds={new Set(state.households.map((household) => household.id))}
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
