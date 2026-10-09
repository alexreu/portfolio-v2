"use client";

import { tabBar, type SiteMode, type Tab } from "@alexreu/wedding-core";
import {
    Calendar,
    Camera,
    CircleCheck,
    CircleHelp,
    Heart,
    MapPin,
    Send,
    Target,
    type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/use-active-section";
import { useAnchorScroll } from "@/hooks/use-anchor-scroll";

const icons: Record<string, LucideIcon> = {
    programme: Calendar,
    places: MapPin,
    questions: CircleHelp,
    answer: Send,
    table: Target,
    add: Camera,
    thanks: Heart,
    photos: Camera,
};

const iconOf = (tab: Tab) => (tab.emphasis === "done" ? CircleCheck : (icons[tab.key] ?? Calendar));

/** The section being read is lit; the action that matters now stays filled. */
const tabClass = (tab: Tab, current: boolean) =>
    cn(
        "flex min-h-13.5 flex-col items-center justify-center gap-0.5 rounded-full text-[0.8rem] whitespace-nowrap transition-colors",
        tab.emphasis === "primary" && "bg-demo-ink text-demo-card font-medium",
        tab.emphasis === "done" && "text-demo-olive font-medium",
        tab.emphasis === "normal" && "text-demo-muted",
        current &&
            tab.emphasis !== "primary" &&
            "bg-demo-olive/15 text-demo-olive-dark font-medium",
    );

type DemoTabBarProps = {
    mode: SiteMode;
    answered: boolean;
    /** The functions the formula opens: no tab leads to a missing one. */
    gallery: boolean;
    table: boolean;
    onAddPhotos: () => void;
};

/** Thumb-reach shortcuts on phones; only the action that matters now is filled. */
export const DemoTabBar = ({ mode, answered, gallery, table, onAddPhotos }: DemoTabBarProps) => {
    const scrollTo = useAnchorScroll();
    const tabs = tabBar(mode, { answered, gallery, table });
    const active = useActiveSection(tabs.map((tab) => tab.href));
    return (
        <nav
            aria-label="Accès rapide"
            style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
            className="bg-demo-card/95 border-demo-line fixed inset-x-0 bottom-0 z-30 grid gap-1.5 border-t px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
        >
            {tabs.map((tab) => {
                const Icon = iconOf(tab);
                const content = (
                    <>
                        <Icon aria-hidden="true" className="size-5.5" strokeWidth={1.6} />
                        {tab.label}
                    </>
                );
                return tab.key === "add" ? (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={onAddPhotos}
                        className={cn(tabClass(tab, false), "cursor-pointer")}
                    >
                        {content}
                    </button>
                ) : (
                    <a
                        key={tab.key}
                        href={tab.href}
                        onClick={scrollTo}
                        aria-current={tab.href === active ? "location" : undefined}
                        className={tabClass(tab, tab.href === active)}
                    >
                        {content}
                    </a>
                );
            })}
        </nav>
    );
};
