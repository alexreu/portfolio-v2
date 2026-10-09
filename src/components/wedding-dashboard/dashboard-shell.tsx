"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    canSee,
    catererSheet,
    galleryArchive,
    groupLabel,
    guestListCsv,
    householdIdFor,
    momentsFromPlans,
    monogram,
    previewOf,
    resolveFeatures,
    roleLabel,
    weddingCalendar,
    weddingExport,
    type Actor,
    type HouseholdRecord,
    type Resize,
} from "@alexreu/wedding-core";
import {
    galleryPoster,
    householdInvitations,
    seatingPoster,
    sharedInvitation,
} from "@alexreu/wedding-core/prints";
import { FeatureFlagProvider } from "@alexreu/wedding-core/react";
import { useLenis } from "lenis/react";
import { ExternalLink, LogIn, RotateCcw } from "lucide-react";

import { demoFlags, demoPlanName, PLAN_PARAMS } from "@/lib/wedding-demo/offer";
import { pageAt, SHARED_MARK } from "@/lib/wedding-demo/routes";
import { useDemoPlan } from "@/hooks/use-demo-plan";
import { useNow } from "@/hooks/use-now";
import { useStoredFlag } from "@/hooks/use-stored-flag";
import { useWeddingDemo } from "@/hooks/use-wedding-demo";

import { ConfirmPopover } from "./confirm-popover";
import { DashboardProvider, type Dashboard } from "./dashboard-context";
import { DashboardNav, MENU_FOLDED_KEY } from "./dashboard-nav";
import { dashboardHref } from "./dashboard-pages";
import { buttonStyles, Select } from "./dashboard-ui";
import { HouseholdDialog } from "./household-dialog";
import { HouseholdPanel } from "./household-panel";

const HIGHLIGHT_MS = 2_500;
const GUESTS = dashboardHref("guests");

const siteUrl = () => `${window.location.origin}/mariage/demo`;

const linkFor = (household: HouseholdRecord) =>
    `${siteUrl()}?foyer=${encodeURIComponent(household.id)}`;

/** What the shared faire-part's code opens: the site, addressed to nobody. */
const sharedUrl = () => `${siteUrl()}?${SHARED_MARK}`;

const seatingUrl = () => `${siteUrl()}/plan-de-table`;

const galleryUrl = () => `${siteUrl()}/galerie`;

const dayAfterUrl = () => previewOf(`${siteUrl()}?apres`);

const download = (filename: string, content: Blob) => {
    const url = URL.createObjectURL(content);
    const link = Object.assign(document.createElement("a"), { href: url, download: filename });
    link.click();
    URL.revokeObjectURL(url);
};

const downloadPdf = (filename: string, bytes: Uint8Array) =>
    download(filename, new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));

/** Only loaded when asked for: the PDF library stays out of the page. */
const printPdf = () => import("@alexreu/wedding-core/pdf");

/** The demo's photos come from photo libraries that resize them by their address. */
const resizePhoto: Resize = (src, width) => {
    const url = new URL(src);
    url.searchParams.set("auto", "compress");
    url.searchParams.set("w", String(width));
    return url.toString();
};

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

/** A page of a function the formula the demo plays does not include. */
const NotInFormula = ({ plan, onShowAll }: { plan: string; onShowAll: () => void }) => (
    <section
        aria-labelledby="hors-formule-titre"
        className="border-wed-line-soft bg-wed-paper grid justify-items-start gap-3 rounded-2xl border p-6"
    >
        <h1 id="hors-formule-titre" className="font-wed-serif text-3xl font-medium">
            Cette page n&apos;est pas dans la formule {plan}
        </h1>
        <p className="text-wed-muted text-sm">
            Avec {plan}, elle n&apos;apparaît pas dans le menu des mariés. Elle s&apos;ajoute avec
            une autre formule ou en option.
        </p>
        <button type="button" onClick={onShowAll} className={buttonStyles.secondary}>
            Voir la formule Signature
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
    /** The formula the demo plays: what the menu, the pages and the buttons open. */
    const [plan, setPlan] = useDemoPlan();
    const flags = demoFlags(plan);
    const now = useNow();
    const lenis = useLenis();
    const router = useRouter();
    const pathname = usePathname();
    const [creating, setCreating] = useState(false);
    const [highlightId, setHighlightId] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);
    /** The demo can show the dashboard as someone the couple let in sees it. */
    const [viewerId, setViewerId] = useState<string | null>(null);
    /** Opened from a magic link: `?vue=` shows the dashboard as that person sees it. */
    useEffect(() => {
        const asked = new URLSearchParams(window.location.search).get("vue");
        if (asked) setViewerId(asked);
    }, []);
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
    const moments = momentsFromPlans(state.moments, design.date, state.timezone);
    const looking = state.collaborators.find((collaborator) => collaborator.id === viewerId);
    /** The couple, or someone they let in: their role, adjusted, within the Signature formula. */
    const access = looking
        ? { role: looking.role, added: looking.added, removed: looking.removed }
        : { role: "couple" as const, added: [], removed: [] };
    const actor: Actor = looking ? { kind: "collaborator", access } : { kind: "couple" };
    const features = resolveFeatures({ ...access, flags });
    /** Closed to the couple too: the formula lacks the function, not the person looking. */
    const inFormula = canSee(resolveFeatures({ role: "couple", flags }), pageAt(pathname));
    const can = (feature: Parameters<typeof features.has>[0]) => features.has(feature);
    const open = canSee(features, pageAt(pathname));

    const startAgain = () => {
        setDetailId(null);
        setViewerId(null);
        reset();
    };

    const dashboard: Dashboard = {
        state,
        can,
        dispatch: (command) => dispatch(command, { actor }),
        now,
        calendar,
        moments,
        linkFor,
        siteUrl: siteUrl(),
        sharedUrl: sharedUrl(),
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
                            (group) => groupLabel(state.groups, group),
                            { diets: can("guests.diets.read") },
                        ),
                    ],
                    { type: "text/csv;charset=utf-8" },
                ),
            ),
        exportCatererPdf: async () => {
            /** Only loaded when asked for: the PDF library stays out of the page. */
            const { catererPdf } = await printPdf();
            const sheet = catererSheet(state, calendar, new Date());
            downloadPdf(sheet.filename, await catererPdf(sheet));
        },
        downloadSharedInvitation: async () => {
            const { invitationPdf } = await printPdf();
            const print = sharedInvitation(design, calendar, sharedUrl());
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
            const archive = galleryArchive(design, state.photos, resizePhoto);
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
        remind: () => {
            dispatch({ type: "reminders.send" }, { actor });
        },
        planName: demoPlanName(plan),
        flags,
        exportData: () => {
            const file = weddingExport(state, new Date());
            download(file.filename, new Blob([file.content], { type: "application/json" }));
        },
    };

    return (
        <DashboardProvider value={dashboard}>
            <FeatureFlagProvider {...access} flags={flags}>
                <div className="grid min-h-dvh grid-cols-[minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,1fr)]">
                    <DashboardNav
                        couple={`${design.first} & ${design.second}`}
                        monogram={monogram(design.first, design.second)}
                        subtitle={`${calendar.dateLabel} · ${demoPlanName(plan)}`}
                        householdCount={state.households.length}
                        canOpen={(page) => canSee(features, page)}
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
                                <label className="text-wed-ink-soft flex items-center gap-2">
                                    <span className="whitespace-nowrap">Formule</span>
                                    <Select
                                        value={plan}
                                        onChange={(event) =>
                                            setPlan(event.target.value as typeof plan)
                                        }
                                        wrapperClassName="w-auto min-w-36"
                                        className="min-h-10 py-0 text-sm"
                                    >
                                        {(Object.keys(PLAN_PARAMS) as (typeof plan)[]).map(
                                            (option) => (
                                                <option key={option} value={option}>
                                                    {demoPlanName(option)}
                                                </option>
                                            ),
                                        )}
                                    </Select>
                                </label>
                                {state.collaborators.length > 0 && (
                                    <label className="text-wed-ink-soft flex items-center gap-2">
                                        <span className="whitespace-nowrap">Voir en tant que</span>
                                        <Select
                                            value={viewerId ?? ""}
                                            onChange={(event) =>
                                                setViewerId(event.target.value || null)
                                            }
                                            wrapperClassName="w-auto min-w-36"
                                            className="min-h-10 py-0 text-sm"
                                        >
                                            <option value="">Vous deux</option>
                                            {state.collaborators.map((collaborator) => (
                                                <option
                                                    key={collaborator.id}
                                                    value={collaborator.id}
                                                >
                                                    {collaborator.firstName} ·{" "}
                                                    {roleLabel(collaborator)}
                                                </option>
                                            ))}
                                        </Select>
                                    </label>
                                )}
                                <Link href="/mariage/demo/connexion" className={buttonStyles.quiet}>
                                    <LogIn aria-hidden="true" />
                                    Connexion
                                </Link>
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
                        ) : !inFormula ? (
                            <NotInFormula
                                plan={demoPlanName(plan)}
                                onShowAll={() => setPlan("signature")}
                            />
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
                        timezone={state.timezone}
                        groups={state.groups}
                        activity={state.activity}
                        now={now}
                        linkFor={linkFor}
                        allowed={{
                            resend: can("guests.write"),
                            edit: can("guests.write"),
                            answer: can("guests.write"),
                            remove: can("guests.write"),
                            print: can("household.print"),
                            diets: can("guests.diets.read"),
                        }}
                        onDownloadInvitation={(household) =>
                            dashboard.downloadHouseholdInvitations([household])
                        }
                        onEdit={(household, draft) =>
                            dashboard.dispatch({
                                type: "household.update",
                                householdId: household.id,
                                draft,
                            })
                        }
                        onAnswer={(household, draft) =>
                            dashboard.dispatch({
                                type: "household.answer",
                                householdId: household.id,
                                draft,
                            })
                        }
                        onResendLink={(household) =>
                            dashboard.dispatch({
                                type: "household.resendLink",
                                householdId: household.id,
                            }).ok
                        }
                        onRemove={(household) => {
                            setDetailId(null);
                            dashboard.dispatch({
                                type: "household.remove",
                                householdId: household.id,
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
                        open={creating}
                        onOpenChange={setCreating}
                        moments={moments}
                        groups={state.groups}
                        linkFor={linkFor}
                        onCreate={(draft) => {
                            const result = dashboard.dispatch({ type: "household.create", draft });
                            if (!result.ok) return null;
                            /** New households come first in the list. */
                            const [household] = result.value.households;
                            setHighlightId(household.id);
                            return household;
                        }}
                    />
                </div>
            </FeatureFlagProvider>
        </DashboardProvider>
    );
};
