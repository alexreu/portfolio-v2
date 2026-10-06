import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { WeddingPlan, WeddingService } from "@/lib/wedding-service/types";

import { SectionIntro } from "./section-intro";

type WeddingPricingProps = {
    pricing: WeddingService["pricing"];
};

const formatPrice = (price: number) => price.toLocaleString("fr-FR");

const PlanCard = ({ plan }: { plan: WeddingPlan }) => (
    <article
        aria-labelledby={`formule-${plan.name}`}
        className={cn(
            "relative flex flex-col rounded-md border p-7 md:p-8",
            plan.featured
                ? "border-wed-ink bg-wed-ink text-wed-night-text"
                : "border-wed-line bg-wed-ivory",
        )}
    >
        {plan.featured && (
            <p className="bg-wed-gold-soft text-wed-ink absolute -top-3 left-7 rounded-xs px-2.5 py-1 text-[0.7rem] tracking-[0.14em] uppercase">
                Le plus choisi
            </p>
        )}
        <h3 id={`formule-${plan.name}`} className="font-wed-serif text-[2.1rem] font-medium">
            {plan.name}
        </h3>
        <p
            className={cn(
                "mt-1 min-h-11 text-sm",
                plan.featured ? "text-wed-night-muted" : "text-wed-muted",
            )}
        >
            {plan.tagline}
        </p>
        <p
            className={cn(
                "my-6 flex items-baseline gap-2 border-b pb-6",
                plan.featured ? "border-wed-night-line" : "border-wed-line",
            )}
        >
            <span className="font-wed-serif text-6xl leading-none font-medium">
                {formatPrice(plan.price)}
            </span>
            <span className={plan.featured ? "text-wed-night-muted" : "text-wed-muted"}>€</span>
        </p>
        <ul className="grid flex-1 content-start gap-2.5 text-[0.95rem]">
            {plan.inherits && (
                <li
                    className={cn(
                        "flex gap-2.5 italic",
                        plan.featured ? "text-wed-night-muted" : "text-wed-muted",
                    )}
                >
                    <Minus aria-hidden="true" className="mt-1 size-4 shrink-0" />
                    Tout {plan.inherits}, plus :
                </li>
            )}
            {plan.items.map((item) => (
                <li key={item} className="flex gap-2.5">
                    <Check
                        aria-hidden="true"
                        className={cn(
                            "mt-1 size-4 shrink-0",
                            plan.featured ? "text-wed-gold-soft" : "text-wed-gold",
                        )}
                    />
                    {item}
                </li>
            ))}
        </ul>
        <a
            href="#contact"
            className={cn(
                "mt-8 inline-flex min-h-12 items-center justify-center rounded-sm px-5 font-medium transition-colors",
                plan.featured
                    ? "bg-wed-ivory text-wed-ink hover:bg-wed-paper"
                    : "border-wed-ink hover:bg-wed-ink hover:text-wed-paper border",
            )}
        >
            Choisir {plan.name}
        </a>
        <p
            className={cn(
                "mt-3 text-center text-xs",
                plan.featured ? "text-wed-night-muted" : "text-wed-muted",
            )}
        >
            {plan.delivery}
        </p>
    </article>
);

export const WeddingPricing = ({ pricing }: WeddingPricingProps) => (
    <section
        id="tarifs"
        aria-labelledby="tarifs-titre"
        className="border-wed-line-soft bg-wed-paper scroll-mt-20 border-y py-20 md:py-28"
    >
        <div className="mx-auto max-w-300 px-6">
            <SectionIntro content={pricing} headingId="tarifs-titre" />
            <div className="mx-auto grid max-w-lg gap-6 lg:max-w-none lg:grid-cols-3 lg:gap-5">
                {pricing.plans.map((plan) => (
                    <PlanCard key={plan.name} plan={plan} />
                ))}
            </div>
            <h3 className="sr-only">Options</h3>
            <dl className="border-wed-line mt-10 grid border-t md:grid-cols-3 md:gap-x-6">
                {pricing.options.map((option) => (
                    <div
                        key={option.label}
                        className="border-wed-line flex justify-between gap-3 border-b py-4 text-sm"
                    >
                        <dt>{option.label}</dt>
                        <dd className="font-medium whitespace-nowrap">{option.price}</dd>
                    </div>
                ))}
            </dl>
            <p className="text-wed-muted mt-5 text-xs">{pricing.note}</p>
        </div>
    </section>
);
