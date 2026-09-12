"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import type { MaintenanceSection } from "@/lib/sanity/types";

import { AnimatedDetails } from "./animated-details";

export const Maintenance = ({ data }: { data: MaintenanceSection }) => {
    const [openPlanKey, setOpenPlanKey] = useState<string | null>(null);

    return (
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
            <ul className="grid items-start gap-3 md:grid-cols-3">
                {data.plans?.map((plan) => (
                    <li
                        key={plan._key}
                        className="rounded-xl border border-white/10 bg-white/2 p-4"
                    >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h4 className="text-sm font-medium text-white">{plan.name}</h4>
                            <p className="text-lg font-semibold whitespace-nowrap text-white">
                                {plan.price.toLocaleString("fr-FR")} €
                                <span className="ml-2 text-xs font-normal text-gray-400">
                                    /mois HT
                                </span>
                            </p>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-gray-400">{plan.summary}</p>
                        {!!plan.features?.length && (
                            <AnimatedDetails
                                id={`maintenance-${plan._key}`}
                                label="Voir ce qui est inclus"
                                screenReaderSuffix={`dans la formule ${plan.name}`}
                                isOpen={openPlanKey === plan._key}
                                onToggle={() =>
                                    setOpenPlanKey((current) =>
                                        current === plan._key ? null : plan._key,
                                    )
                                }
                                className="mt-3 border-t border-white/10 pt-1"
                                buttonClassName="py-2 text-left text-xs font-medium text-gray-200"
                                contentClassName="pt-2 pb-1"
                            >
                                <>
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
                                </>
                            </AnimatedDetails>
                        )}
                    </li>
                ))}
            </ul>
            {data.footerNote && (
                <p className="mt-4 text-xs leading-relaxed text-gray-500">{data.footerNote}</p>
            )}
        </section>
    );
};
