import { Code, Palette, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";

import { GlassCard } from "@/components/new-design/GlassCard";

const services = [
    {
        icon: Code,
        title: "Intégration Web",
        description: "Développement d'interfaces React/Next.js performantes et pixel-perfect",
        features: ["React & Next.js", "TypeScript", "Responsive Design"],
    },
    {
        icon: Palette,
        title: "Design UI/UX",
        description: "Création d'expériences utilisateur modernes et intuitives",
        features: ["Design System", "Prototypage", "Figma to Code"],
    },
    {
        icon: Zap,
        title: "Optimisation Performance",
        description: "Amélioration de la vitesse et des performances web",
        features: ["Core Web Vitals", "Lighthouse", "Bundle Optimization"],
    },
    {
        icon: TrendingUp,
        title: "Référencement SEO",
        description: "Optimisation pour les moteurs de recherche et visibilité maximale",
        features: ["SEO Technique", "Meta Tags", "Schema Markup"],
    },
];

export const ServicesCard = () => {
    return (
        <GlassCard className="h-full p-8 md:p-10">
            <div className="flex h-full flex-col space-y-8">
                {/* Header */}
                <div className="space-y-3">
                    <span className="text-sm font-semibold tracking-wider text-[#FF4D4D] uppercase">
                        Mes Services
                    </span>
                    <h2 className="text-accent text-3xl font-bold md:text-4xl">
                        Ce que je fais <span className="text-[#FF4D4D]">de mieux</span> 💡
                    </h2>
                    <p className="text-lg text-gray-400">
                        Des solutions web complètes pour transformer votre présence digitale
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid flex-1 gap-6 md:grid-cols-2">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.02, duration: 0.4, ease: "easeOut" }}
                                whileHover={{ y: -4, scale: 1.02 }}
                                className="group/service relative rounded-2xl border border-white/5 bg-white/3 p-6 transition-all duration-300 hover:border-[#FF4D4D]/30 hover:bg-white/6"
                            >
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#FF4D4D]/0 to-purple-500/0 transition-all duration-300 group-hover/service:from-[#FF4D4D]/5 group-hover/service:to-purple-500/5" />

                                <div className="relative z-10 space-y-4">
                                    {/* Icon with glow */}
                                    <div className="relative h-14 w-14">
                                        <div className="absolute inset-0 rounded-xl bg-[#FF4D4D]/20 blur-lg transition-all duration-300 group-hover/service:bg-[#FF4D4D]/40" />
                                        <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-linear-to-br from-[#FF4D4D]/20 to-[#FF4D4D]/10 transition-all duration-300 group-hover/service:from-[#FF4D4D]/30 group-hover/service:to-[#FF4D4D]/20">
                                            <Icon className="h-7 w-7 text-[#FF4D4D]" />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-accent text-xl font-bold transition-colors duration-300 group-hover/service:text-[#FF4D4D]">
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-muted text-sm leading-relaxed">
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {service.features.map((feature) => (
                                            <span
                                                key={feature}
                                                className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition-all duration-300 group-hover/service:border-[#FF4D4D]/20 group-hover/service:text-[#FF4D4D]"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Corner accent */}
                                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#FF4D4D] opacity-0 transition-opacity duration-300 group-hover/service:opacity-100" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </GlassCard>
    );
};
