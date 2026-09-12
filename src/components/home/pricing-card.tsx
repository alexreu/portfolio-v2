"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import type { MaintenanceSection, PricingPlan } from "@/lib/sanity/types";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";

import { AnimatedDetails } from "./animated-details";
import { Maintenance } from "./maintenance";

type PricingCardProps = {
    plans?: PricingPlan[];
    maintenance?: MaintenanceSection | null;
};

export const PricingCard = ({ plans = [], maintenance }: PricingCardProps) => {
    const [openPlanId, setOpenPlanId] = useState<string | null>(null);

    return (
        <GlassCard className="p-4 sm:p-8 md:p-10" hoverScale={false}>
            <section aria-labelledby="pricing-heading" className="space-y-8">
                <div className="space-y-3 text-center">
                    <span className="text-primary text-sm font-semibold tracking-wider uppercase">
                        Tarifs
                    </span>
                    <h2 id="pricing-heading" className="text-accent text-3xl font-bold md:text-4xl">
                        Choisissez votre <span className="text-primary">formule</span>
                    </h2>
                    <p className="text-gray-300">
                        Investissez dans un site qui travaille pour vous.
                    </p>
                </div>

                <div className="grid items-start gap-4 xl:grid-cols-3">
                    {plans.map((plan) => {
                        // Legacy documents stay readable until their highlights are migrated.
                        const highlights = (
                            plan.highlights ??
                            plan.featureCategories?.flatMap((category) => category.items) ??
                            []
                        ).slice(0, 8);
                        const details = plan.featureCategories?.filter(
                            (category) => category.items?.length,
                        );
                        return (
                            <article
                                key={plan._id}
                                className={`flex min-w-0 flex-col self-start rounded-2xl border bg-white/3 p-5 transition-[border-color,box-shadow] duration-300 sm:p-6 xl:min-h-[41rem] ${plan.isPopular ? "border-primary/40" : "border-white/10"}`}
                            >
                                <div className="space-y-2 xl:min-h-32">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-xl font-semibold text-white">
                                            {plan.name}
                                        </h3>
                                        {plan.isPopular && (
                                            <span className="text-primary text-xs">Recommandé</span>
                                        )}
                                    </div>
                                    {plan.subtitle && (
                                        <p className="text-sm font-medium text-gray-200">
                                            {plan.subtitle}
                                        </p>
                                    )}
                                    {plan.description && (
                                        <p className="text-sm leading-relaxed text-gray-400">
                                            {plan.description}
                                        </p>
                                    )}
                                </div>
                                <div className="my-4 border-b border-white/10 pb-4">
                                    {plan.startingFrom && (
                                        <p className="mb-1 text-xs text-gray-400">À partir de</p>
                                    )}
                                    <p className="flex flex-wrap items-baseline gap-x-2">
                                        <span className="text-3xl font-semibold tracking-tight text-white">
                                            {plan.priceType === "custom"
                                                ? plan.priceCustom || "Sur devis"
                                                : plan.price?.toLocaleString("fr-FR")}
                                        </span>
                                        {plan.priceType === "fixed" && (
                                            <span className="text-sm text-gray-400">€ HT</span>
                                        )}
                                    </p>
                                </div>
                                <ul className="grid gap-1 sm:grid-cols-2 xl:grid-cols-1">
                                    {highlights.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2 text-sm text-gray-300"
                                        >
                                            <Check
                                                aria-hidden="true"
                                                className="text-primary mt-0.5 size-4 shrink-0"
                                            />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                {plan.context && (
                                    <p className="mt-4 text-xs leading-relaxed text-gray-400">
                                        <span className="font-medium text-gray-200">
                                            {plan.contextLabel || "Options"} :{" "}
                                        </span>
                                        {plan.context}
                                    </p>
                                )}
                                {!!details?.length && (
                                    <AnimatedDetails
                                        id={`pricing-${plan._id}`}
                                        label="Détails de l’offre"
                                        screenReaderSuffix={plan.name}
                                        isOpen={openPlanId === plan._id}
                                        onToggle={() =>
                                            setOpenPlanId((current) =>
                                                current === plan._id ? null : plan._id,
                                            )
                                        }
                                        className="mt-3 text-sm text-gray-300"
                                        buttonClassName="py-2 text-left"
                                        contentClassName="space-y-3 py-3"
                                    >
                                        <>
                                            {details.map((category, index) => (
                                                <div key={index}>
                                                    <h4 className="font-medium text-white">
                                                        {category.categoryName}
                                                    </h4>
                                                    <ul className="mt-2 list-inside list-disc space-y-1 text-gray-400">
                                                        {category.items.map((item, itemIndex) => (
                                                            <li key={itemIndex}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </>
                                    </AnimatedDetails>
                                )}
                                <div className="mt-auto pt-4">
                                    <Button
                                        variant={plan.isPopular ? "primary" : "ghost"}
                                        fullWidth
                                        className="rounded-xl"
                                        asChild
                                    >
                                        <a href="#contact">
                                            {plan.ctaText || "Parler de mon projet"}
                                        </a>
                                    </Button>
                                </div>
                            </article>
                        );
                    })}
                </div>
                {!plans.length && (
                    <p className="text-center text-sm text-gray-300">
                        Chaque projet est unique.{" "}
                        <a href="#contact" className="text-primary underline">
                            Contactez-moi pour un devis.
                        </a>
                    </p>
                )}
                {maintenance && <Maintenance data={maintenance} />}
                <p className="text-center text-xs text-gray-400">
                    Paiement en 3 fois sans frais possible · Devis gratuit sous 24 h
                </p>
            </section>
        </GlassCard>
    );
};
