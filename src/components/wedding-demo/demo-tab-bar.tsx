import {
    Calendar,
    Camera,
    CircleCheck,
    CircleHelp,
    MapPin,
    Send,
    Target,
    type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { SiteMode } from "@/lib/wedding/site-mode";
import { tabBar, type Tab } from "@/lib/wedding/tab-bar";

const icons: Record<string, LucideIcon> = {
    programme: Calendar,
    lieux: MapPin,
    questions: CircleHelp,
    reponse: Send,
    table: Target,
    ajouter: Camera,
};

const iconOf = (tab: Tab) => (tab.emphasis === "done" ? CircleCheck : (icons[tab.key] ?? Calendar));

const tabClass = (tab: Tab) =>
    cn(
        "flex min-h-13.5 flex-col items-center justify-center gap-0.5 rounded-full text-[0.8rem] whitespace-nowrap",
        tab.emphasis === "primary" && "bg-demo-ink text-demo-card font-medium",
        tab.emphasis === "done" && "text-demo-olive font-medium",
        tab.emphasis === "normal" && "text-demo-muted",
    );

type DemoTabBarProps = {
    mode: SiteMode;
    answered: boolean;
    onAddPhotos: () => void;
};

/** Thumb-reach shortcuts on phones; only the action that matters now is filled. */
export const DemoTabBar = ({ mode, answered, onAddPhotos }: DemoTabBarProps) => (
    <nav
        aria-label="Accès rapide"
        className="bg-demo-card/95 border-demo-line fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 gap-1.5 border-t px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
    >
        {tabBar(mode, { answered }).map((tab) => {
            const Icon = iconOf(tab);
            const content = (
                <>
                    <Icon aria-hidden="true" className="size-5.5" strokeWidth={1.6} />
                    {tab.label}
                </>
            );
            return tab.key === "ajouter" ? (
                <button
                    key={tab.key}
                    type="button"
                    onClick={onAddPhotos}
                    className={cn(tabClass(tab), "cursor-pointer")}
                >
                    {content}
                </button>
            ) : (
                <a key={tab.key} href={tab.href} className={tabClass(tab)}>
                    {content}
                </a>
            );
        })}
    </nav>
);
