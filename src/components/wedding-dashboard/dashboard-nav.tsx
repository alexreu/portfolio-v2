"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    Armchair,
    BellRing,
    CalendarClock,
    CalendarDays,
    ExternalLink,
    Images,
    LayoutGrid,
    RotateCcw,
    Stamp,
    Users,
    type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { ConfirmPopover } from "./confirm-popover";

const sections: readonly { id: string; label: string; icon: LucideIcon }[] = [
    { id: "apercu", label: "Vue d'ensemble", icon: LayoutGrid },
    { id: "invites", label: "Invités", icon: Users },
    { id: "dates", label: "Dates", icon: CalendarClock },
    { id: "programme", label: "Programme", icon: CalendarDays },
    { id: "plan-de-table", label: "Plan de table", icon: Armchair },
    { id: "faire-part", label: "Faire-part", icon: Stamp },
    { id: "relances", label: "Relances", icon: BellRing },
    { id: "galerie", label: "Galerie", icon: Images },
];

/** The section crossing the upper third of the screen is the one being read. */
const useActiveSection = () => {
    const [active, setActive] = useState(sections[0].id);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const seen = entries.find((entry) => entry.isIntersecting);
                if (seen) setActive(seen.target.id);
            },
            { rootMargin: "-25% 0px -70% 0px" },
        );
        sections.forEach(({ id }) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });
        return () => observer.disconnect();
    }, []);
    return active;
};

type DashboardNavProps = {
    couple: string;
    /** "C & H", for the narrow bar on phones. */
    monogram: string;
    subtitle: string;
    householdCount: number;
    onReset: () => void;
};

export const DashboardNav = ({
    couple,
    monogram,
    subtitle,
    householdCount,
    onReset,
}: DashboardNavProps) => {
    const active = useActiveSection();
    const strip = useRef<HTMLUListElement>(null);

    /** On a phone the tabs scroll sideways: the one being read slides to the middle. */
    useEffect(() => {
        const list = strip.current;
        const link = list?.querySelector<HTMLElement>(`a[href="#${active}"]`);
        if (!list || !link) return;
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        list.scrollTo({
            left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2,
            behavior: still ? "auto" : "smooth",
        });
    }, [active]);

    const links = (compact: boolean) =>
        sections.map(({ id, label, icon: Icon }) => (
            <li key={id}>
                <a
                    href={`#${id}`}
                    aria-current={active === id ? "location" : undefined}
                    className={cn(
                        "flex items-center gap-3 rounded-full transition-colors",
                        compact
                            ? "min-h-10 px-3.5 text-[0.8rem] whitespace-nowrap"
                            : "min-h-11 px-3.5 text-sm",
                        active === id
                            ? "bg-wed-night-line text-wed-night-text"
                            : "text-wed-night-muted hover:bg-wed-night-line/60 hover:text-wed-night-text",
                    )}
                >
                    <Icon aria-hidden="true" className="size-4.5 shrink-0" strokeWidth={1.6} />
                    {label}
                    {id === "invites" && !compact && (
                        <span className="bg-wed-night-line text-wed-night-text ml-auto rounded-full px-2 text-xs">
                            {householdCount}
                        </span>
                    )}
                </a>
            </li>
        ));

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

            <aside className="bg-wed-night text-wed-night-text sticky top-0 hidden h-dvh flex-col gap-8 px-4 py-6 lg:flex">
                <div className="px-3.5">
                    <p className="font-wed-serif text-[1.75rem] leading-tight">{couple}</p>
                    <p className="text-wed-night-muted mt-1 text-xs">{subtitle}</p>
                </div>
                <nav aria-label="Sections du tableau de bord">
                    <ul className="grid gap-0.5">{links(false)}</ul>
                </nav>
                <div className="border-wed-night-line text-wed-night-muted mt-auto grid gap-1 border-t pt-4 text-sm">
                    <a
                        href="/mariage/demo"
                        target="_blank"
                        rel="noopener"
                        className="hover:text-wed-night-text flex min-h-10 items-center gap-2 rounded-full px-3.5"
                    >
                        <ExternalLink aria-hidden="true" className="size-4" />
                        Site des invités
                    </a>
                    <ConfirmPopover
                        question="Revenir aux données de départ ?"
                        detail="Vos essais dans ce navigateur seront effacés."
                        confirmLabel="Réinitialiser"
                        onConfirm={onReset}
                    >
                        <button
                            type="button"
                            className="hover:text-wed-night-text flex min-h-10 cursor-pointer items-center gap-2 rounded-full px-3.5 text-left"
                        >
                            <RotateCcw aria-hidden="true" className="size-4" />
                            Réinitialiser la démo
                        </button>
                    </ConfirmPopover>
                    <Link
                        href="/mariage"
                        className="hover:text-wed-night-text flex min-h-10 items-center rounded-full px-3.5"
                    >
                        ← L&apos;offre Sites de mariage
                    </Link>
                </div>
            </aside>
        </>
    );
};
