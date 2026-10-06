import type { WeddingService } from "@/lib/wedding-service/types";

import { SectionIntro } from "./section-intro";

type WeddingStepsProps = {
    steps: WeddingService["steps"];
};

export const WeddingSteps = ({ steps }: WeddingStepsProps) => (
    <section aria-labelledby="deroule-titre" className="py-20 md:py-28">
        <div className="mx-auto max-w-300 px-6">
            <SectionIntro content={steps} headingId="deroule-titre" />
            <ol className="grid gap-9 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
                {steps.items.map((step, index) => (
                    <li key={step.title} className="border-wed-line border-l pr-6 pl-5">
                        <span className="font-wed-serif text-wed-gold text-4xl leading-none italic">
                            {index + 1}
                        </span>
                        <h3 className="mt-4 mb-1.5 font-medium">{step.title}</h3>
                        <p className="text-wed-muted text-sm leading-relaxed">{step.text}</p>
                        <p className="text-wed-gold mt-3.5 text-sm">{step.duration}</p>
                    </li>
                ))}
            </ol>
        </div>
    </section>
);
