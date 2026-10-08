"use client";

import { useEffect, useRef, type ReactElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ExternalLink, PanelLeftClose, PanelLeftOpen, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DashboardPage } from "@/lib/wedding-dashboard/pages";
import { planOf } from "@/lib/wedding-dashboard/plans";
import { previewOf } from "@/lib/wedding-dashboard/preview-link";
import { useStoredFlag } from "@/hooks/use-stored-flag";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { ConfirmPopover } from "./confirm-popover";
import { dashboardEntries, dashboardHref } from "./dashboard-pages";

const entries = dashboardEntries.map((entry) => ({
    ...entry,
    id: entry.page ?? "apercu",
    href: dashboardHref(entry.page),
}));

/** The page being read; a trailing slash or a sub-path still lights its entry. */
const useActivePage = () => {
    const pathname = usePathname().replace(/\/$/, "");
    return (
        [...entries]
            .reverse()
            .find((entry) => pathname === entry.href || pathname.startsWith(`${entry.href}/`))
            ?.id ?? "apercu"
    );
};

/** The label of an icon on the folded menu, shown beside it on hover and on focus. */
const Hint = ({
    label,
    enabled,
    children,
    wrap = (trigger) => trigger,
}: {
    label: string;
    enabled: boolean;
    children: ReactElement;
    /** For a trigger that also opens something, such as a confirmation. */
    wrap?: (trigger: ReactElement) => ReactElement;
}) => (
    <Tooltip open={enabled ? undefined : false}>
        {wrap(<TooltipTrigger asChild>{children}</TooltipTrigger>)}
        <TooltipContent
            side="right"
            sideOffset={12}
            className="bg-wed-night text-wed-night-text border-wed-night-line font-main rounded-lg border px-2.5 py-1.5 text-[0.8rem] shadow-lg"
        >
            {label}
        </TooltipContent>
    </Tooltip>
);

/** The visitor's choice of a folded menu, kept in this browser. */
export const MENU_FOLDED_KEY = "mariage-demo-menu-replie";

/** The menu's width eases in and out; texts fade out at once and back in once there is room. */
const FOLD_EASE = "duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none";

const fade = (shown: boolean) =>
    cn(
        "transition-opacity duration-150 ease-out motion-reduce:transition-none",
        shown ? "opacity-100 delay-150" : "opacity-0",
    );

type DashboardNavProps = {
    couple: string;
    /** "C & H", for the narrow bar on phones. */
    monogram: string;
    subtitle: string;
    householdCount: number;
    /** The pages the person looking may open; the others leave the menu. */
    canOpen: (page: DashboardPage | null) => boolean;
    onReset: () => void;
};

/**
 * The menu holds its own folded state: folding it re-renders the menu alone, not the page
 * beside it, so the very first frame of the animation is not spent on the guest list.
 */
export const DashboardNav = ({
    couple,
    monogram,
    subtitle,
    householdCount,
    canOpen,
    onReset,
}: DashboardNavProps) => {
    const [folded, onFold] = useStoredFlag(MENU_FOLDED_KEY);
    const active = useActivePage();
    const strip = useRef<HTMLUListElement>(null);

    const placed = useRef(false);

    /**
     * On a phone the tabs scroll sideways: the open page's tab stands in the middle, put there
     * at once on arrival, then sliding there from one page to the next.
     */
    useEffect(() => {
        const list = strip.current;
        const link = list?.querySelector<HTMLElement>('[aria-current="page"]');
        if (!list || !link) return;
        const still =
            !placed.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        placed.current = true;
        list.scrollTo({
            left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2,
            behavior: still ? "auto" : "smooth",
        });
    }, [active]);

    const sideItem = "flex min-h-10 items-center gap-2.5 rounded-full px-3.5 whitespace-nowrap";
    /** Labels stay in place, still read aloud, and only fade: nothing jumps while it folds. */
    const label = fade(!folded);

    /** On the folded menu, the name of the icon, with the guest count or the formula. */
    const hint = (id: string, name: string) => {
        if (id === "invites") return `${name} · ${householdCount}`;
        const plan = planOf(id);
        return plan ? `${name} · ${plan.note}` : name;
    };

    const links = (compact: boolean) =>
        entries
            .filter((entry) => canOpen(entry.page))
            .map(({ id, href, label: name, icon: Icon }) => {
                const plan = planOf(id);
                const link = (
                    <Link
                        href={href}
                        aria-current={active === id ? "page" : undefined}
                        className={cn(
                            "flex items-center gap-3 rounded-full whitespace-nowrap transition-colors",
                            compact ? "min-h-10 px-3.5 text-[0.8rem]" : "min-h-11 px-3.5 text-sm",
                            active === id
                                ? "bg-wed-night-line text-wed-night-text"
                                : "text-wed-night-muted hover:bg-wed-night-line/60 hover:text-wed-night-text",
                        )}
                    >
                        <Icon aria-hidden="true" className="size-4.5 shrink-0" strokeWidth={1.6} />
                        <span className={cn(!compact && label)}>{name}</span>
                        {id === "invites" && !compact && (
                            <span
                                className={cn(
                                    "bg-wed-night-line text-wed-night-text ml-auto rounded-full px-2 text-xs",
                                    label,
                                )}
                            >
                                {householdCount}
                            </span>
                        )}
                        {plan && !compact && (
                            <span
                                aria-hidden="true"
                                className={cn(
                                    "border-wed-night-line text-wed-night-muted ml-auto rounded-full border px-2 text-[0.7rem]",
                                    label,
                                )}
                            >
                                {plan.from}
                            </span>
                        )}
                    </Link>
                );
                return (
                    <li key={id}>
                        {compact ? (
                            link
                        ) : (
                            <Hint label={hint(id, name)} enabled={folded}>
                                {link}
                            </Hint>
                        )}
                    </li>
                );
            });

    return (
        <>
            <header className="bg-wed-night text-wed-night-text sticky top-0 z-30 flex h-14 items-center gap-2 pl-4 lg:hidden">
                <p className="font-wed-serif shrink-0 text-xl italic">{monogram}</p>
                <nav aria-label="Sections du tableau de bord" className="min-w-0 flex-1">
                    <ul
                        ref={strip}
                        className="relative flex gap-1 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-28px),transparent)] px-2 py-2 [scrollbar-width:none]"
                    >
                        {links(true)}
                    </ul>
                </nav>
            </header>

            <TooltipProvider delayDuration={150} skipDelayDuration={0}>
                <aside
                    className={cn(
                        "bg-wed-night text-wed-night-text sticky top-0 hidden h-dvh flex-col gap-8 overflow-x-hidden overflow-y-auto px-4 py-6 transition-[width] lg:flex",
                        FOLD_EASE,
                        folded ? "w-[4.875rem]" : "w-64",
                    )}
                >
                    {/* Both stay drawn at a fixed width and cross-fade: the name never rewraps. */}
                    <div className="relative h-[3.4rem] shrink-0">
                        <div className={cn("absolute top-0 left-0 w-56 px-3.5", label)}>
                            <p className="font-wed-serif text-[1.75rem] leading-tight whitespace-nowrap">
                                {couple}
                            </p>
                            <p className="text-wed-night-muted mt-1 text-xs whitespace-nowrap">
                                {subtitle}
                            </p>
                        </div>
                        <p
                            aria-hidden="true"
                            className={cn(
                                "font-wed-serif absolute top-0 left-0 w-[2.875rem] text-center text-lg leading-[2.5rem] whitespace-nowrap italic",
                                fade(folded),
                            )}
                        >
                            {monogram}
                        </p>
                    </div>
                    <nav id="menu-tableau-de-bord" aria-label="Sections du tableau de bord">
                        <ul className="grid gap-0.5">{links(false)}</ul>
                    </nav>
                    <div className="border-wed-night-line text-wed-night-muted mt-auto grid gap-1 border-t pt-4 text-sm">
                        <Hint label="Déplier le menu" enabled={folded}>
                            <button
                                type="button"
                                onClick={() => onFold(!folded)}
                                aria-expanded={!folded}
                                aria-controls="menu-tableau-de-bord"
                                className={cn(sideItem, "hover:text-wed-night-text cursor-pointer")}
                            >
                                {folded ? (
                                    <PanelLeftOpen aria-hidden="true" className="size-4 shrink-0" />
                                ) : (
                                    <PanelLeftClose
                                        aria-hidden="true"
                                        className="size-4 shrink-0"
                                    />
                                )}
                                <span className={label}>
                                    {folded ? "Déplier le menu" : "Replier le menu"}
                                </span>
                            </button>
                        </Hint>
                        <Hint label="Site des invités" enabled={folded}>
                            <a
                                href={previewOf("/mariage/demo")}
                                target="_blank"
                                rel="noopener"
                                className={cn(sideItem, "hover:text-wed-night-text")}
                            >
                                <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
                                <span className={label}>Site des invités</span>
                            </a>
                        </Hint>
                        <Hint
                            label="Réinitialiser la démo"
                            enabled={folded}
                            wrap={(trigger) => (
                                <ConfirmPopover
                                    question="Revenir aux données de départ ?"
                                    detail="Vos essais dans ce navigateur seront effacés."
                                    confirmLabel="Réinitialiser"
                                    onConfirm={onReset}
                                >
                                    {trigger}
                                </ConfirmPopover>
                            )}
                        >
                            <button
                                type="button"
                                className={cn(
                                    sideItem,
                                    "hover:text-wed-night-text cursor-pointer text-left",
                                )}
                            >
                                <RotateCcw aria-hidden="true" className="size-4 shrink-0" />
                                <span className={label}>Réinitialiser la démo</span>
                            </button>
                        </Hint>
                        <Hint label="L'offre Sites de mariage" enabled={folded}>
                            <Link
                                href="/mariage"
                                className={cn(sideItem, "hover:text-wed-night-text")}
                            >
                                <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
                                <span className={label}>L&apos;offre Sites de mariage</span>
                            </Link>
                        </Hint>
                    </div>
                </aside>
            </TooltipProvider>
        </>
    );
};
