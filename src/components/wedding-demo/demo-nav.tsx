import { cn } from "@/lib/utils";
import type { SiteMode } from "@/lib/wedding/site-mode";

const links = [
    { label: "Notre histoire", href: "#histoire" },
    { label: "Programme", href: "#programme" },
    { label: "Lieux", href: "#lieux" },
    { label: "Dress code", href: "#dresscode" },
    { label: "Photos", href: "#photos" },
    { label: "Questions", href: "#faq" },
] as const;

type DemoNavProps = {
    monogram: string;
    mode: SiteMode;
    onTogglePreview: () => void;
};

export const DemoNav = ({ monogram, mode, onTogglePreview }: DemoNavProps) => (
    <header className="bg-demo-paper/90 border-demo-line sticky top-0 z-30 border-b backdrop-blur-md">
        <div className="relative mx-auto flex h-16 max-w-310 items-center justify-center px-4 md:justify-between md:px-7">
            <a
                href="#top"
                className="font-demo-serif inline-flex min-h-11 items-center text-xl italic"
            >
                {monogram}
            </a>
            <nav aria-label="Sections" className="hidden md:block">
                <ul className="flex gap-7 text-[0.95rem]">
                    {links.map((link) => (
                        <li key={link.href}>
                            <a href={link.href} className="text-demo-ink-2 hover:text-demo-ink">
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="absolute right-4 flex items-center gap-2.5 md:static">
                <button
                    type="button"
                    aria-pressed={mode === "day"}
                    onClick={onTogglePreview}
                    title="Démonstration : voir le site tel qu'il apparaît le jour du mariage"
                    className={cn(
                        "min-h-10 cursor-pointer rounded-full border border-dashed px-3.5 text-[0.8rem] whitespace-nowrap transition-colors md:text-sm",
                        mode === "day"
                            ? "bg-demo-olive border-demo-olive border-solid text-white"
                            : "border-demo-olive text-demo-olive",
                    )}
                >
                    Aperçu jour J
                </button>
                {mode === "before" && (
                    <a
                        href="#rsvp"
                        className="bg-demo-ink text-demo-card hover:bg-demo-ink-2 hidden min-h-11 items-center rounded-full px-5 text-sm transition-colors md:inline-flex"
                    >
                        Répondre
                    </a>
                )}
            </div>
        </div>
    </header>
);
