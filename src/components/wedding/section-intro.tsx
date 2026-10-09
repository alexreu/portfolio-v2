import { cn } from "@/lib/utils";
import type { SectionIntro as SectionIntroContent } from "@/lib/wedding-service/types";

import { EmphasisHeading } from "./emphasis-heading";

type SectionIntroProps = {
    content: SectionIntroContent;
    headingId: string;
    tone?: "light" | "dark";
};

export const SectionIntro = ({ content, headingId, tone = "light" }: SectionIntroProps) => (
    <div className="mb-12 grid items-end gap-6 md:mb-16 md:grid-cols-2 md:gap-12">
        <div>
            <p
                className={cn(
                    "text-xs font-medium tracking-[0.18em] uppercase",
                    tone === "dark" ? "text-wed-gold-soft" : "text-wed-gold",
                )}
            >
                {content.eyebrow}
            </p>
            <EmphasisHeading
                id={headingId}
                heading={content.heading}
                className="mt-3 text-4xl leading-[1.05] md:text-6xl"
                emphasisClassName={tone === "dark" ? "text-wed-gold-soft" : "text-wed-gold"}
            />
        </div>
        {content.intro && (
            <p
                className={cn(
                    "text-base leading-relaxed md:text-lg",
                    tone === "dark" ? "text-wed-night-muted" : "text-wed-muted",
                )}
            >
                {content.intro}
            </p>
        )}
    </div>
);
