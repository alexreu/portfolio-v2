import { Check, ChevronDown } from "lucide-react";

import type { MaintenanceSection } from "@/lib/sanity/types";

export const Maintenance = ({ data }: { data: MaintenanceSection }) => (
    <section aria-labelledby="maintenance-heading" className="border-t border-white/10 pt-8">
        <div className="mb-5 max-w-2xl space-y-2">
            <p className="text-primary text-xs font-semibold tracking-wider uppercase">
                Maintenance
            </p>
            <h3 id="maintenance-heading" className="text-xl font-semibold text-white">
                {data.title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">{data.description}</p>
        </div>
        <ul className="grid overflow-hidden rounded-xl border border-white/10 bg-white/2 md:grid-cols-3">
            {data.plans?.map((plan) => (
                <li
                    key={plan._key}
                    className="border-white/10 p-4 not-first:border-t md:not-first:border-t-0 md:not-first:border-l"
                >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="text-sm font-medium text-white">{plan.name}</h4>
                        <p className="text-lg font-semibold whitespace-nowrap text-white">
                            {plan.price.toLocaleString("fr-FR")} €
                            <span className="text-xs font-normal text-gray-400">/mois HT</span>
                        </p>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-gray-400">{plan.summary}</p>
                    {!!plan.features?.length && (
                        <details className="group mt-3 border-t border-white/10 pt-1">
                            <summary className="focus-visible:outline-primary flex cursor-pointer list-none items-center justify-between gap-3 rounded py-2 text-xs font-medium text-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden">
                                <span>
                                    Voir ce qui est inclus
                                    <span className="sr-only"> dans la formule {plan.name}</span>
                                </span>
                                <ChevronDown
                                    aria-hidden="true"
                                    className="size-4 shrink-0 transition-transform group-open:rotate-180"
                                />
                            </summary>
                            <div className="pt-2 pb-1">
                                {plan.detailsIntro && (
                                    <p className="mb-2 text-xs font-medium text-gray-300">
                                        {plan.detailsIntro}
                                    </p>
                                )}
                                <ul className="space-y-1.5">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-2 text-xs leading-relaxed text-gray-400"
                                        >
                                            <Check
                                                aria-hidden="true"
                                                className="text-primary mt-0.5 size-3.5 shrink-0"
                                            />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </details>
                    )}
                </li>
            ))}
        </ul>
        {data.footerNote && (
            <p className="mt-4 text-xs leading-relaxed text-gray-500">{data.footerNote}</p>
        )}
    </section>
);
