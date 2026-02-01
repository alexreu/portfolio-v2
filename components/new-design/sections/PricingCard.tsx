import {
    Check,
    Code,
    Database,
    Headphones,
    Layers,
    Palette,
    Rocket,
    Shield,
    Sparkles,
    TrendingUp,
    Zap,
} from "lucide-react";

import { GlassCard } from "../GlassCard";

const pricingPlans = [
    {
        name: "Starter",
        subtitle: "Offre spéciale template",
        description: "Solution rapide et économique",
        price: "790",
        period: "+ 30€/mois",
        commitment: "Engagement maintenance 12 mois",
        icon: Layers,
        popular: false,
        features: [
            {
                category: "Inclus",
                items: [
                    "Template personnalisé",
                    "Design responsive",
                    "3 pages",
                    "Formulaire contact",
                ],
            },
            {
                category: "Technique",
                items: ["SEO basique", "Google Analytics", "Livraison 1 semaine"],
            },
        ],
        icons: [
            { icon: Layers, label: "Template" },
            { icon: Code, label: "Dev" },
        ],
    },
    {
        name: "Sur Mesure",
        subtitle: "Le meilleur rapport qualité/prix",
        description: "Design unique et adapté",
        price: "1400",
        period: "+ 40€/mois",
        commitment: "Sans engagement",
        icon: Sparkles,
        popular: true,
        features: [
            {
                category: "Design",
                items: [
                    "Design 100% personnalisé",
                    "Animations sur-mesure",
                    "UX optimisée",
                    "Responsive tous appareils",
                ],
            },
            {
                category: "Technique",
                items: ["Jusqu'à 10 pages", "Blog intégré", "SEO optimisé", "Performance maximale"],
            },
            {
                category: "Support",
                items: ["Support 60 jours", "Formation complète", "Livraison 3 semaines"],
            },
        ],
        icons: [
            { icon: Sparkles, label: "Custom" },
            { icon: Palette, label: "Design" },
            { icon: Zap, label: "Perf" },
            { icon: TrendingUp, label: "SEO" },
        ],
    },
    {
        name: "Business",
        subtitle: "Solution entreprise complète",
        description: "Pour aller plus loin",
        price: "2500",
        period: "+ 60€/mois",
        commitment: "Évolutif",
        icon: Rocket,
        popular: false,
        features: [
            {
                category: "Design",
                items: [
                    "Design System complet",
                    "Interface complexe",
                    "Multi-langues",
                    "Accessibilité WCAG",
                ],
            },
            {
                category: "Technique",
                items: [
                    "Pages illimitées",
                    "CMS Headless (Sanity/Strapi)",
                    "SEO avancé",
                    "API & Intégrations",
                    "Tests automatisés",
                ],
            },
            {
                category: "Support",
                items: [
                    "Support 90 jours",
                    "Accompagnement dédié",
                    "Évolutions incluses",
                    "Formation équipe",
                ],
            },
        ],
        icons: [
            { icon: Rocket, label: "Business" },
            { icon: Database, label: "CMS" },
            { icon: Shield, label: "Premium" },
            { icon: Headphones, label: "Support Pro" },
        ],
    },
];

export const PricingCard = () => {
    return (
        <GlassCard className="h-full p-8 md:p-10" hoverScale={false}>
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-3 text-center">
                    <span className="text-sm font-semibold tracking-wider text-[#FF4D4D] uppercase">
                        Tarifs
                    </span>
                    <h2 className="text-accent text-3xl font-bold md:text-4xl">
                        Choisissez votre <span className="text-[#FF4D4D]">formule</span>
                    </h2>
                    <p className="text-lg text-gray-400">
                        Des solutions adaptées à chaque projet et budget
                    </p>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid items-center gap-6 md:grid-cols-3">
                    {pricingPlans.map((plan, index) => {
                        const Icon = plan.icon;
                        const isPremium = plan.popular;

                        return (
                            <div
                                key={plan.name}
                                className={`relative transition-all duration-300 ${isPremium ? "md:z-10 md:scale-110" : "md:hover:scale-105"}`}
                            >
                                {/* Glow effect for Popular card */}
                                {isPremium && (
                                    <>
                                        <div className="absolute -inset-6 -z-10 rounded-3xl bg-[#FF4D4D]/20 blur-3xl" />
                                        <div className="absolute -inset-1 -z-10 rounded-2xl bg-linear-to-br from-[#FF4D4D]/50 via-[#FF4D4D]/20 to-purple-500/20" />
                                    </>
                                )}

                                {/* Card */}
                                <div
                                    className={`relative h-full rounded-2xl border p-6 transition-all duration-300 ${
                                        isPremium
                                            ? "border-[#FF4D4D]/40 bg-linear-to-b from-[#1a1a1a] to-[#0f0f0f] shadow-xl"
                                            : "border-[#333] bg-[#111111] hover:border-[#444]"
                                    }`}
                                >
                                    {/* Popular Badge */}
                                    {isPremium && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FF4D4D] to-[#ff6b6b] px-5 py-2 text-xs font-bold tracking-wider text-white uppercase shadow-lg shadow-[#FF4D4D]/50">
                                            ⭐ Recommandé
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="space-y-6">
                                        {/* Header */}
                                        <div className="space-y-3 pt-2">
                                            <div
                                                className={`flex h-14 w-14 items-center justify-center rounded-xl border ${
                                                    isPremium
                                                        ? "border-[#FF4D4D]/30 bg-[#FF4D4D]/20"
                                                        : "border-white/10 bg-white/5"
                                                }`}
                                            >
                                                <Icon
                                                    className={`h-7 w-7 ${isPremium ? "text-[#FF4D4D]" : "text-gray-400"}`}
                                                />
                                            </div>

                                            <div>
                                                <h3
                                                    className={`text-accent text-2xl font-bold ${isPremium ? "text-white" : ""}`}
                                                >
                                                    {plan.name}
                                                </h3>
                                                <p
                                                    className={`mt-1 text-xs font-semibold ${
                                                        isPremium
                                                            ? "text-[#FF4D4D]"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    {plan.subtitle}
                                                </p>
                                                <p className="mt-1 text-sm text-gray-400">
                                                    {plan.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div
                                            className={`border-y py-6 ${isPremium ? "border-[#FF4D4D]/20" : "border-white/5"}`}
                                        >
                                            <div className="flex items-baseline gap-1">
                                                <span
                                                    className={`text-6xl font-bold ${isPremium ? "text-[#FF4D4D]" : "text-white"}`}
                                                >
                                                    {plan.price}
                                                </span>
                                                <span className="text-3xl font-bold text-gray-500">
                                                    €
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-400">
                                                {plan.period}
                                            </p>
                                            <p
                                                className={`mt-2 text-xs ${isPremium ? "text-gray-400" : "text-gray-600"}`}
                                            >
                                                {plan.commitment}
                                            </p>
                                        </div>

                                        {/* Feature Icons */}
                                        <div className="flex flex-wrap gap-2">
                                            {plan.icons.map((item, idx) => {
                                                const FeatureIcon = item.icon;
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`group relative rounded-lg border px-3 py-2 transition-all duration-300 ${
                                                            isPremium
                                                                ? "border-[#FF4D4D]/20 bg-[#FF4D4D]/5 hover:border-[#FF4D4D]/40 hover:bg-[#FF4D4D]/10"
                                                                : "border-white/5 bg-white/[0.03] hover:border-white/10"
                                                        }`}
                                                        title={item.label}
                                                    >
                                                        <FeatureIcon
                                                            className={`h-4 w-4 ${
                                                                isPremium
                                                                    ? "text-[#FF4D4D]"
                                                                    : "text-gray-400 group-hover:text-white"
                                                            } transition-colors`}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Features by Category */}
                                        <div className="space-y-4">
                                            {plan.features.map((category, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <div
                                                        className={`text-xs font-semibold tracking-wider uppercase ${
                                                            isPremium
                                                                ? "text-[#FF4D4D]"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {category.category}
                                                    </div>
                                                    <div className="space-y-2">
                                                        {category.items.map((item, itemIdx) => (
                                                            <div
                                                                key={itemIdx}
                                                                className="flex items-start gap-2 text-sm"
                                                            >
                                                                <Check
                                                                    className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                                                                        isPremium
                                                                            ? "text-[#FF4D4D]"
                                                                            : "text-gray-600"
                                                                    }`}
                                                                />
                                                                <span
                                                                    className={
                                                                        isPremium
                                                                            ? "text-gray-200"
                                                                            : "text-gray-400"
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
                                        <button
                                            className={`w-full rounded-xl px-6 py-4 font-bold transition-all duration-300 ${
                                                isPremium
                                                    ? "bg-[#FF4D4D] text-white shadow-lg shadow-[#FF4D4D]/30 hover:-translate-y-1 hover:scale-105 hover:bg-[#ff6b6b] hover:shadow-[#FF4D4D]/50"
                                                    : "border-2 border-white/10 bg-transparent text-white hover:border-white/20 hover:bg-white/5"
                                            }`}
                                        >
                                            {isPremium ? "Démarrer mon projet" : "En savoir plus"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Note */}
                <div className="space-y-2 pt-6 text-center">
                    <p className="text-sm text-gray-400">
                        💳 Paiement en 3 fois sans frais possible • 🎯 Devis gratuit sous 24h
                    </p>
                    <button className="text-sm font-semibold text-[#FF4D4D] hover:underline">
                        Comparer les offres en détail →
                    </button>
                </div>
            </div>
        </GlassCard>
    );
};
