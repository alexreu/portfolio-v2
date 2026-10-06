import { Plus } from "lucide-react";

import type { WeddingService } from "@/lib/wedding-service/types";

import { EmphasisHeading } from "./emphasis-heading";

type WeddingFaqProps = {
    faq: WeddingService["faq"];
};

export const WeddingFaq = ({ faq }: WeddingFaqProps) => (
    <section id="faq" aria-labelledby="faq-titre" className="pb-20 md:pb-28">
        <div className="mx-auto grid max-w-300 gap-8 px-6 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <div>
                <p className="text-wed-gold text-xs font-medium tracking-[0.18em] uppercase">
                    {faq.eyebrow}
                </p>
                <EmphasisHeading
                    id="faq-titre"
                    heading={faq.heading}
                    className="mt-3 text-4xl leading-[1.05] md:text-6xl"
                />
            </div>
            <div>
                {faq.items.map((item, index) => (
                    <details
                        key={item.question}
                        open={index === 0}
                        className="group border-wed-line border-b first:border-t"
                    >
                        <summary className="font-wed-serif flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.4rem] leading-snug font-medium [&::-webkit-details-marker]:hidden">
                            {item.question}
                            <span
                                aria-hidden="true"
                                className="border-wed-line grid size-7 shrink-0 place-items-center rounded-full border transition-transform group-open:rotate-45"
                            >
                                <Plus className="size-3.5" />
                            </span>
                        </summary>
                        <p className="text-wed-ink-soft pr-12 pb-6">{item.answer}</p>
                    </details>
                ))}
            </div>
        </div>
    </section>
);
