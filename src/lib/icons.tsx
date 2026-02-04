import {
    Briefcase,
    Code,
    Crown,
    Database,
    Headphones,
    Layers,
    Layout,
    type LucideIcon,
    Palette,
    Rocket,
    Search,
    Shield,
    Smartphone,
    Sparkles,
    Target,
    TrendingUp,
    Wrench,
    Zap,
} from "lucide-react";

/**
 * Map icon names (from Sanity) to Lucide components
 */
const iconMap: Record<string, LucideIcon> = {
    Code,
    Palette,
    Zap,
    TrendingUp,
    Layout,
    Smartphone,
    Search,
    Shield,
    Layers,
    Sparkles,
    Rocket,
    Database,
    Headphones,
    Crown,
    Wrench,
    Target,
    Briefcase,
};

/**
 * Get a Lucide icon component by name
 * @param name - Icon name from Sanity
 * @param fallback - Fallback icon if not found
 */
export const getIcon = (name: string, fallback: LucideIcon = Code): LucideIcon => {
    return iconMap[name] || fallback;
};

export { iconMap };
