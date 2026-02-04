import { ArrowRight, Palette, Target, TrendingUp, Wrench, Zap } from "lucide-react";

import { getIcon } from "@/lib/icons";
import type { SkillCategory } from "@/lib/sanity/types";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";

const categoryThemes = {
    primary: {
        icon: "text-primary",
        iconBg: "bg-primary/15",
        iconBorder: "border-primary/30",
        glow: "bg-primary/5",
    },
    amber: {
        icon: "text-amber-400",
        iconBg: "bg-amber-400/15",
        iconBorder: "border-amber-400/30",
        glow: "bg-amber-400/5",
    },
    emerald: {
        icon: "text-emerald-500",
        iconBg: "bg-emerald-500/15",
        iconBorder: "border-emerald-500/30",
        glow: "bg-emerald-500/5",
    },
    purple: {
        icon: "text-purple-500",
        iconBg: "bg-purple-500/15",
        iconBorder: "border-purple-500/30",
        glow: "bg-purple-500/5",
    },
} as const;

type ThemeKey = keyof typeof categoryThemes;

type SkillsCardProps = {
    categories?: SkillCategory[];
};

// Default skills when Sanity data is not available
const defaultCategories: SkillCategory[] = [
    {
        _id: "1",
        title: "Front-end & UI",
        subtitle: "Des interfaces qui convertissent et fidélisent",
        icon: "Palette",
        theme: "primary",
        skills: [
            {
                name: "React & Next.js",
                description: "Applications rapides et modernes",
                emoji: "⚛️",
            },
            { name: "TypeScript", description: "Code fiable et maintenable", emoji: "📘" },
            { name: "Tailwind CSS", description: "Design system cohérent", emoji: "🎨" },
            { name: "Animations", description: "Expériences interactives fluides", emoji: "✨" },
        ],
        order: 0,
    },
    {
        _id: "2",
        title: "Performance & Qualité",
        subtitle: "Vitesse = meilleur référencement et conversions",
        icon: "Zap",
        theme: "amber",
        skills: [
            { name: "Optimisation", description: "Temps de chargement < 2 secondes", emoji: "⚡" },
            { name: "Core Web Vitals", description: "Score Google Lighthouse > 90", emoji: "📊" },
            { name: "Bundle Optimization", description: "Code léger et performant", emoji: "📦" },
            { name: "Lazy Loading", description: "Chargement progressif intelligent", emoji: "🚀" },
        ],
        order: 1,
    },
    {
        _id: "3",
        title: "Accessibilité & SEO",
        subtitle: "Visible par tous, trouvé par Google",
        icon: "TrendingUp",
        theme: "emerald",
        skills: [
            { name: "SEO Technique", description: "Première page Google garantie", emoji: "🎯" },
            { name: "WCAG 2.1", description: "Accessible à tous les utilisateurs", emoji: "♿" },
            { name: "Schema Markup", description: "Rich snippets & featured results", emoji: "🏷️" },
            { name: "Meta Tags", description: "Partages sociaux optimisés", emoji: "🔗" },
        ],
        order: 2,
    },
    {
        _id: "4",
        title: "Outils & Workflow",
        subtitle: "Collaboration fluide et livraison rapide",
        icon: "Wrench",
        theme: "purple",
        skills: [
            { name: "Git & GitHub", description: "Versioning professionnel", emoji: "📦" },
            { name: "Figma to Code", description: "Intégration pixel-perfect", emoji: "🎨" },
            { name: "CI/CD", description: "Déploiements automatisés", emoji: "🔄" },
            { name: "Documentation", description: "Code maintenable et évolutif", emoji: "📚" },
        ],
        order: 3,
    },
];

export const SkillsCard = ({ categories }: SkillsCardProps) => {
    const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

    return (
        <GlassCard className="h-full p-8 md:p-10">
            <div className="flex h-full flex-col space-y-8">
                {/* Header */}
                <div className="space-y-3">
                    <span className="text-primary text-sm font-semibold tracking-wider uppercase">
                        Compétences
                    </span>
                    <h2 className="text-accent text-3xl font-bold md:text-4xl">
                        Technologies qui{" "}
                        <span className="text-primary">génèrent des résultats</span>
                    </h2>
                    <p className="text-lg text-gray-300">
                        Stack moderne orientée performance, conversion et croissance
                    </p>
                </div>

                {/* Skills Grid */}
                <div className="grid flex-1 gap-6 md:grid-cols-2">
                    {displayCategories.map((category) => {
                        const Icon = getIcon(category.icon, Palette);
                        const theme =
                            categoryThemes[category.theme as ThemeKey] || categoryThemes.primary;
                        return (
                            <div
                                key={category._id}
                                className="group relative rounded-2xl border border-white/5 bg-white/2 p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/4"
                            >
                                {/* Decorative glow */}
                                <div
                                    className={`absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 ${theme.glow}`}
                                />

                                {/* Category Header */}
                                <div className="mb-6 flex items-start gap-4">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${theme.iconBg} ${theme.iconBorder}`}
                                    >
                                        <Icon className={`h-6 w-6 ${theme.icon}`} />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-accent mb-1 text-lg font-bold">
                                            {category.title}
                                        </h3>
                                        <p className="text-xs leading-relaxed text-gray-300">
                                            {category.subtitle}
                                        </p>
                                    </div>
                                </div>

                                {/* Skills List */}
                                <div className="space-y-3">
                                    {category.skills.map((skill, idx) => (
                                        <div
                                            key={idx}
                                            className="group/skill flex items-start gap-3 rounded-lg bg-white/2 p-3 transition-all duration-200 hover:bg-white/4"
                                        >
                                            {/* Emoji Icon */}
                                            <span className="shrink-0 text-xl">
                                                {skill.emoji || "•"}
                                            </span>

                                            {/* Skill Info */}
                                            <div className="min-w-0 flex-1">
                                                <div className="group-hover/skill:text-primary text-sm font-semibold text-white transition-colors">
                                                    {skill.name}
                                                </div>
                                                {skill.description && (
                                                    <div className="mt-0.5 text-xs leading-relaxed text-gray-300">
                                                        {skill.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="flex items-center justify-center pt-4">
                    <Button variant="secondary" size="sm">
                        <Target className="text-primary h-4 w-4" />
                        Voir mon approche technique
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        </GlassCard>
    );
};
