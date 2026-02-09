"use client";

import { ArrowRight, Code } from "lucide-react";
import { motion } from "motion/react";

import { getIcon } from "@/lib/icons";
import type { ServiceV2 } from "@/lib/sanity/types";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";

type ServicesCardProps = {
    services?: ServiceV2[];
};

// Default services when Sanity data is not available
const defaultServices: ServiceV2[] = [
    {
        _id: "1",
        icon: "Code",
        title: "Intégration Web",
        description: "Développement d'interfaces React/Next.js performantes et pixel-perfect",
        features: ["React & Next.js", "TypeScript", "Responsive Design"],
        order: 0,
    },
    {
        _id: "2",
        icon: "Palette",
        title: "Design UI/UX",
        description: "Création d'expériences utilisateur modernes et intuitives",
        features: ["Design System", "Prototypage", "Figma to Code"],
        order: 1,
    },
    {
        _id: "3",
        icon: "Zap",
        title: "Optimisation Performance",
        description: "Amélioration de la vitesse et des performances web",
        features: ["Core Web Vitals", "Lighthouse", "Bundle Optimization"],
        order: 2,
    },
    {
        _id: "4",
        icon: "TrendingUp",
        title: "Référencement SEO",
        description: "Optimisation pour les moteurs de recherche et visibilité maximale",
        features: ["SEO Technique", "Meta Tags", "Schema Markup"],
        order: 3,
    },
];

export const ServicesCard = ({ services }: ServicesCardProps) => {
    const displayServices = services && services.length > 0 ? services : defaultServices;

    return (
        <GlassCard className="h-full p-4 md:p-10">
            <div className="flex h-full flex-col space-y-8">
                {/* Header */}
                <div className="space-y-3">
                    <span className="text-primary text-sm font-semibold tracking-wider uppercase">
                        Mes Services
                    </span>
                    <h2 className="text-accent text-2xl font-bold md:text-4xl">
                        Ce que je fais <span className="text-primary">de mieux</span> 💡
                    </h2>
                    <p className="text-lg text-gray-300">
                        Des solutions web complètes pour transformer votre présence digitale
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid flex-1 gap-6 md:grid-cols-2">
                    {displayServices.map((service, index) => {
                        const Icon = getIcon(service.icon, Code);
                        return (
                            <motion.div
                                key={service._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                whileHover={{ y: -4, scale: 1.02 }}
                                className="group/service hover:border-primary/30 relative rounded-2xl border border-white/5 bg-white/3 p-6 transition-all duration-300 hover:bg-white/6"
                            >
                                {/* Glow effect on hover */}
                                <div className="from-primary/0 group-hover/service:from-primary/5 absolute inset-0 rounded-2xl bg-linear-to-br to-purple-500/0 transition-all duration-300 group-hover/service:to-purple-500/5" />

                                <div className="relative z-10 space-y-4">
                                    {/* Icon with glow */}
                                    <div className="relative h-14 w-14">
                                        <div className="bg-primary/20 group-hover/service:bg-primary/40 absolute inset-0 rounded-xl blur-lg transition-all duration-300" />
                                        <div className="from-primary/20 to-primary/10 group-hover/service:from-primary/30 group-hover/service:to-primary/20 relative flex h-full w-full items-center justify-center rounded-xl bg-linear-to-br transition-all duration-300">
                                            <Icon className="text-primary h-7 w-7" />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-accent group-hover/service:text-primary text-xl font-bold transition-colors duration-300">
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm leading-relaxed text-gray-300">
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {service.features.map((feature) => (
                                            <span
                                                key={feature}
                                                className="group-hover/service:border-primary/20 group-hover/service:text-primary rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition-all duration-300"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Corner accent */}
                                <div className="bg-primary absolute top-4 right-4 h-2 w-2 rounded-full opacity-0 transition-opacity duration-300 group-hover/service:opacity-100" />
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="pt-4 text-center">
                    <Button variant="ghost" asChild>
                        <a href="#tarifs">
                            Découvrir les tarifs
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </div>
        </GlassCard>
    );
};
