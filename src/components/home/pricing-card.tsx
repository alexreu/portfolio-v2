import { Check, Code, Layers } from "lucide-react";

import { getIcon } from "@/lib/icons";
import type { PricingPlanV2 } from "@/lib/sanity/types";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";

type PricingCardProps = {
    plans?: PricingPlanV2[];
};

// Default pricing plans when Sanity data is not available
const defaultPlans: PricingPlanV2[] = [
    {
        _id: "1",
        name: "Starter",
        subtitle: "Idéal pour démarrer",
        description: "Votre site pro en ligne en 7 jours, clé en main.",
        priceType: "fixed",
        price: 790,
        monthlyFee: "+ 30€/mois",
        commitment: "Engagement maintenance 12 mois",
        icon: "Layers",
        isPopular: false,
        featureCategories: [
            {
                categoryName: "Inclus",
                items: [
                    "Template personnalisé",
                    "Design responsive",
                    "3 pages",
                    "Formulaire contact",
                ],
            },
            {
                categoryName: "Technique",
                items: ["SEO basique", "Google Analytics", "Livraison 1 semaine"],
            },
        ],
        featureIcons: [
            { icon: "Layers", label: "Template" },
            { icon: "Code", label: "Dev" },
        ],
        ctaText: "Lancer mon projet",
        order: 0,
    },
    {
        _id: "2",
        name: "Sur Mesure",
        subtitle: "Le choix n°1 des entrepreneurs ambitieux",
        description: "Un site unique conçu pour convertir vos visiteurs en clients.",
        priceType: "fixed",
        price: 1400,
        monthlyFee: "+ 40€/mois",
        commitment: "Sans engagement",
        icon: "Sparkles",
        isPopular: true,
        featureCategories: [
            {
                categoryName: "Design",
                items: [
                    "Design 100% personnalisé",
                    "Animations sur-mesure",
                    "UX optimisée",
                    "Responsive tous appareils",
                ],
            },
            {
                categoryName: "Technique",
                items: ["Jusqu'à 10 pages", "Blog intégré", "SEO optimisé", "Performance maximale"],
            },
            {
                categoryName: "Support",
                items: ["Support 60 jours", "Formation complète", "Livraison 3 semaines"],
            },
        ],
        featureIcons: [
            { icon: "Sparkles", label: "Custom" },
            { icon: "Palette", label: "Design" },
            { icon: "Zap", label: "Perf" },
            { icon: "TrendingUp", label: "SEO" },
        ],
        ctaText: "Obtenir mon devis gratuit",
        order: 1,
    },
    {
        _id: "3",
        name: "Business",
        subtitle: "Pour les projets qui voient grand",
        description:
            "Application web sur-mesure avec architecture scalable et accompagnement dédié.",
        priceType: "fixed",
        price: 2500,
        monthlyFee: "+ 60€/mois",
        commitment: "Évolutif",
        icon: "Rocket",
        isPopular: false,
        featureCategories: [
            {
                categoryName: "Design",
                items: [
                    "Design System complet",
                    "Interface complexe",
                    "Multi-langues",
                    "Accessibilité WCAG",
                ],
            },
            {
                categoryName: "Technique",
                items: [
                    "Pages illimitées",
                    "CMS Headless (Sanity/Strapi)",
                    "SEO avancé",
                    "API & Intégrations",
                    "Tests automatisés",
                ],
            },
            {
                categoryName: "Support",
                items: [
                    "Support 90 jours",
                    "Accompagnement dédié",
                    "Évolutions incluses",
                    "Formation équipe",
                ],
            },
        ],
        featureIcons: [
            { icon: "Rocket", label: "Business" },
            { icon: "Database", label: "CMS" },
            { icon: "Shield", label: "Premium" },
            { icon: "Headphones", label: "Support Pro" },
        ],
        ctaText: "Réserver un appel stratégique",
        order: 2,
    },
];

export const PricingCard = ({ plans }: PricingCardProps) => {
    const displayPlans = plans && plans.length > 0 ? plans : defaultPlans;

    return (
        <GlassCard className="h-full p-4 sm:p-8 md:p-10" hoverScale={false}>
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-3 text-center">
                    <span className="text-primary text-sm font-semibold tracking-wider uppercase">
                        Tarifs
                    </span>
                    <h2 className="text-accent text-3xl font-bold md:text-4xl">
                        Choisissez votre <span className="text-primary">formule</span>
                    </h2>
                    <p className="text-lg text-gray-300">
                        Investissez dans un site qui travaille pour vous
                    </p>
                </div>

                {/* Pricing Cards Grid */}
                <div className="mt-8 grid items-stretch gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-10">
                    {displayPlans.map((plan) => {
                        const Icon = getIcon(plan.icon || "Layers", Layers);
                        const isPremium = plan.isPopular;

                        return (
                            <div
                                key={plan._id}
                                className={`relative h-full min-w-0 transition-all duration-300 ${isPremium ? "lg:z-10 lg:scale-110" : "lg:hover:scale-105"}`}
                            >
                                {/* Glow effect for Popular card */}
                                {isPremium && (
                                    <>
                                        <div className="bg-primary/20 absolute -inset-6 -z-10 rounded-3xl blur-3xl" />
                                        <div className="from-primary/50 via-primary/20 absolute -inset-1 -z-10 rounded-2xl bg-linear-to-br to-purple-500/20" />
                                    </>
                                )}

                                {/* Card */}
                                <div
                                    className={`relative h-full rounded-2xl border p-6 transition-all duration-300 ${
                                        isPremium
                                            ? "border-primary/40 from-secondary to-background bg-linear-to-b shadow-xl"
                                            : "bg-card border-white/15 hover:border-white/25"
                                    }`}
                                >
                                    {/* Popular Badge */}
                                    {isPremium && (
                                        <div className="from-primary to-primary-light shadow-primary/50 absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r px-5 py-2 text-xs font-bold tracking-wider text-white uppercase shadow-lg">
                                            ⭐ Recommandé
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex h-full flex-col gap-6">
                                        {/* Header */}
                                        <div className={`space-y-3 ${isPremium ? "pt-4" : "pt-2"}`}>
                                            <div
                                                className={`flex h-14 w-14 items-center justify-center rounded-xl border ${
                                                    isPremium
                                                        ? "border-primary/30 bg-primary/20"
                                                        : "border-white/10 bg-white/5"
                                                }`}
                                            >
                                                <Icon
                                                    className={`h-7 w-7 ${isPremium ? "text-primary" : "text-gray-300"}`}
                                                />
                                            </div>

                                            <div>
                                                <h3
                                                    className={`text-accent text-2xl font-bold ${isPremium ? "text-white" : ""}`}
                                                >
                                                    {plan.name}
                                                </h3>
                                                {plan.subtitle && (
                                                    <p
                                                        className={`mt-1 text-xs font-semibold ${
                                                            isPremium
                                                                ? "text-primary"
                                                                : "text-gray-400"
                                                        }`}
                                                    >
                                                        {plan.subtitle}
                                                    </p>
                                                )}
                                                {plan.description && (
                                                    <p className="mt-1 text-sm text-gray-300">
                                                        {plan.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div
                                            className={`border-y py-6 ${isPremium ? "border-primary/20" : "border-white/5"}`}
                                        >
                                            {plan.startingFrom && (
                                                <p
                                                    className={`mb-1 text-sm ${isPremium ? "text-gray-300" : "text-gray-500"}`}
                                                >
                                                    À partir de
                                                </p>
                                            )}
                                            {plan.priceType === "custom" ? (
                                                <div>
                                                    <span
                                                        className={`text-4xl font-bold xl:text-5xl ${isPremium ? "text-primary" : "text-white"}`}
                                                    >
                                                        {plan.priceCustom || "Sur devis"}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-baseline gap-1">
                                                    <span
                                                        className={`text-6xl font-bold ${isPremium ? "text-primary" : "text-white"}`}
                                                    >
                                                        {plan.price}
                                                    </span>
                                                    <span className="text-2xl font-bold text-gray-500 xl:text-3xl">
                                                        € HT
                                                    </span>
                                                </div>
                                            )}
                                            {plan.minimumBudget && (
                                                <p className="mt-2 text-sm text-gray-400">
                                                    Budget minimum conseillé :{" "}
                                                    <span
                                                        className={
                                                            isPremium
                                                                ? "text-primary"
                                                                : "text-white"
                                                        }
                                                    >
                                                        {plan.minimumBudget}
                                                    </span>
                                                </p>
                                            )}
                                            {plan.monthlyFee && (
                                                <p className="mt-2 text-sm text-gray-300">
                                                    {plan.monthlyFee}
                                                </p>
                                            )}
                                            {plan.commitment && (
                                                <p
                                                    className={`mt-2 text-xs ${isPremium ? "text-gray-300" : "text-gray-400"}`}
                                                >
                                                    {plan.commitment}
                                                </p>
                                            )}
                                        </div>

                                        {/* Feature Icons */}
                                        {plan.featureIcons && plan.featureIcons.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {plan.featureIcons.map((item, idx) => {
                                                    const FeatureIcon = getIcon(item.icon, Code);
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`group relative rounded-lg border px-3 py-2 transition-all duration-300 ${
                                                                isPremium
                                                                    ? "border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10"
                                                                    : "border-white/5 bg-white/3 hover:border-white/10"
                                                            }`}
                                                            title={item.label}
                                                        >
                                                            <FeatureIcon
                                                                className={`h-4 w-4 ${
                                                                    isPremium
                                                                        ? "text-primary"
                                                                        : "text-gray-300 group-hover:text-white"
                                                                } transition-colors`}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Features by Category */}
                                        <div className="flex-1 space-y-4">
                                            {plan.featureCategories?.map((category, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <div
                                                        className={`text-xs font-semibold tracking-wider uppercase ${
                                                            isPremium
                                                                ? "text-primary"
                                                                : "text-gray-400"
                                                        }`}
                                                    >
                                                        {category.categoryName}
                                                    </div>
                                                    <div className="space-y-2">
                                                        {category.items.map((item, itemIdx) => (
                                                            <div
                                                                key={itemIdx}
                                                                className="flex items-start gap-2 text-sm"
                                                            >
                                                                <Check
                                                                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                                                                        isPremium
                                                                            ? "text-primary"
                                                                            : "text-gray-400"
                                                                    }`}
                                                                />
                                                                <span
                                                                    className={
                                                                        isPremium
                                                                            ? "text-gray-200"
                                                                            : "text-gray-300"
                                                                    }
                                                                >
                                                                    {item}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* CTA Button */}
                                        <Button
                                            variant={isPremium ? "primary" : "ghost"}
                                            fullWidth
                                            className={
                                                isPremium
                                                    ? "shadow-primary/30 rounded-xl shadow-lg"
                                                    : "rounded-xl"
                                            }
                                            asChild
                                        >
                                            <a href="#contact">
                                                {plan.ctaText ||
                                                    (isPremium
                                                        ? "Démarrer mon projet"
                                                        : "En savoir plus")}
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Note */}
                <div className="mx-auto mt-20 max-w-xl rounded-2xl border border-white/10 bg-white/3 px-6 py-4 text-center">
                    <p className="text-sm text-gray-300">
                        💳 Paiement en 3 fois sans frais possible • 🎯 Devis gratuit sous 24h
                    </p>
                </div>
            </div>
        </GlassCard>
    );
};
