"use client";

import { type SiteMode } from "@alexreu/wedding-core";

import { cn } from "@/lib/utils";
import { useAnchorScroll } from "@/hooks/use-anchor-scroll";
import { SelectField } from "@/components/shared/select-field";

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
    /** The moment the demo shows instead of today: the wedding day, or the day after. */
    preview: SiteMode | null;
    onPreview: (preview: SiteMode | null) => void;
    /** Without a guest gallery in the formula, no « Photos » link. */
    gallery: boolean;
};

/** "Aperçu" is the site as it is today; the others show it ahead of time. */
const previews: readonly { value: string; label: string }[] = [
    { value: "", label: "Aperçu" },
    { value: "day", label: "Jour J" },
    { value: "after", label: "Lendemain" },
];

export const DemoNav = ({ monogram, mode, preview, onPreview, gallery }: DemoNavProps) => {
    const scrollTo = useAnchorScroll();
    return (
        <header className="bg-demo-paper/90 border-demo-line sticky top-0 z-30 border-b backdrop-blur-md">
            <div className="relative mx-auto flex h-16 max-w-310 items-center justify-center px-4 md:justify-between md:px-7">
                <a
                    href="#top"
                    onClick={scrollTo}
                    className="font-demo-serif inline-flex min-h-11 items-center text-xl italic"
                >
                    {monogram}
                </a>
                <nav aria-label="Sections" className="hidden md:block">
                    <ul className="flex gap-7 text-[0.95rem]">
                        {links
                            .filter((link) => gallery || link.href !== "#photos")
                            .map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={scrollTo}
                                        className="text-demo-ink-2 hover:text-demo-ink"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                    </ul>
                </nav>
                <div className="absolute right-4 flex items-center gap-2.5 md:static">
                    <label className="sr-only" htmlFor="apercu-du-site">
                        Démonstration : voir le site
                    </label>
                    <SelectField
                        id="apercu-du-site"
                        value={preview ?? ""}
                        onChange={(event) =>
                            onPreview((event.target.value || null) as SiteMode | null)
                        }
                        title="Démonstration : voir le site tel qu'il apparaît le jour du mariage, ou le lendemain"
                        wrapperClassName="w-auto"
                        chevronClassName={cn(
                            "right-3 size-3.5",
                            preview ? "text-white" : "text-demo-olive",
                        )}
                        className={cn(
                            "min-h-11 rounded-full border border-dashed pr-8 pl-3.5 text-[0.8rem] md:text-sm",
                            preview
                                ? "bg-demo-olive border-demo-olive border-solid text-white"
                                : "border-demo-olive text-demo-olive bg-transparent",
                        )}
                    >
                        {previews.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </SelectField>
                    {mode === "before" && (
                        <a
                            href="#rsvp"
                            onClick={scrollTo}
                            className="bg-demo-ink text-demo-card hover:bg-demo-ink-2 hidden min-h-11 items-center rounded-full px-5 text-sm transition-colors md:inline-flex"
                        >
                            Répondre
                        </a>
                    )}
                </div>
            </div>
        </header>
    );
};
