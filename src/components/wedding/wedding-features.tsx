import { BarChart3, Link2, Mail, MapPin, Printer, QrCode, type LucideIcon } from "lucide-react";

import type { WeddingService } from "@/lib/wedding-service/types";

import { SectionIntro } from "./section-intro";

type WeddingFeaturesProps = {
    features: WeddingService["features"];
};

/** Decorative only, in the order of the default content. */
const icons: readonly LucideIcon[] = [Mail, Link2, MapPin, QrCode, BarChart3, Printer];

export const WeddingFeatures = ({ features }: WeddingFeaturesProps) => (
    <section
        id="fonctionnalites"
        aria-labelledby="fonctionnalites-titre"
        className="scroll-mt-18 py-20 md:py-28"
    >
        <div className="mx-auto max-w-300 px-6">
            <SectionIntro content={features} headingId="fonctionnalites-titre" />
            <ul className="border-wed-line grid border-t border-l sm:grid-cols-2 lg:grid-cols-3">
                {features.items.map((feature, index) => {
                    const Icon = icons[index % icons.length];
                    return (
                        <li
                            key={feature.title}
                            className="border-wed-line hover:bg-wed-paper border-r border-b px-7 pt-8 pb-9 transition-colors"
                        >
                            <span className="border-wed-line text-wed-gold mb-6 grid size-11 place-items-center rounded-full border">
                                <Icon aria-hidden="true" className="size-5" strokeWidth={1.4} />
                            </span>
                            <h3 className="font-wed-serif text-[1.6rem] leading-tight font-medium">
                                {feature.title}
                            </h3>
                            <p className="text-wed-ink-soft mt-2 text-[0.95rem] leading-relaxed">
                                {feature.text}
                            </p>
                            <p className="border-wed-line text-wed-muted mt-4 inline-block rounded-xs border px-2 py-1 text-xs tracking-wide">
                                {feature.availability}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </div>
    </section>
);
