import { romanNumeral } from "@alexreu/wedding-core";

import type { WeddingService } from "@/lib/wedding-service/types";

import { SectionIntro } from "./section-intro";

type WeddingMomentsProps = {
    moments: WeddingService["moments"];
};

export const WeddingMoments = ({ moments }: WeddingMomentsProps) => (
    <section
        id="experience"
        aria-labelledby="experience-titre"
        className="border-wed-line-soft bg-wed-paper scroll-mt-18 border-y py-20 md:py-28"
    >
        <div className="mx-auto max-w-300 px-6">
            <SectionIntro content={moments} headingId="experience-titre" />
            <ol className="border-wed-ink grid gap-10 border-t sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
                {moments.items.map((moment, index) => (
                    <li key={moment.title} className="relative pt-7 lg:pr-7">
                        <span
                            aria-hidden="true"
                            className="border-wed-ink bg-wed-ivory absolute -top-[5px] left-0 size-2.5 rounded-full border"
                        />
                        {/* The list already says the order: the numeral is only seen. */}
                        <span
                            aria-hidden="true"
                            className="font-wed-serif text-wed-gold text-2xl tracking-[0.08em]"
                        >
                            {romanNumeral(index + 1)}
                        </span>
                        <h3 className="font-wed-serif mt-3 text-[1.75rem] leading-tight font-medium">
                            {moment.title}
                        </h3>
                        <p className="font-wed-serif text-wed-gold mt-1 text-lg italic">
                            {moment.when}
                        </p>
                        <p className="text-wed-ink-soft mt-2 text-[0.95rem] leading-relaxed">
                            {moment.text}
                        </p>
                    </li>
                ))}
            </ol>
        </div>
    </section>
);
