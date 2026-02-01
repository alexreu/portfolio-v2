import { ReactNode } from "react";
import { motion } from "motion/react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverScale?: boolean;
}

export const GlassCard = ({ children, className = "", hoverScale = true }: GlassCardProps) => {
    return (
        <motion.div
            whileHover={hoverScale ? { scale: 1.02, y: -4 } : {}}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`group relative h-full overflow-hidden rounded-3xl border border-white/8 bg-linear-to-br from-white/[0.07] to-white/2 backdrop-blur-xl ${className}`}
        >
            {/* Hover glow effect */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#FF4D4D]/0 to-purple-500/0 transition-all duration-500 group-hover:from-[#FF4D4D]/5 group-hover:to-purple-500/5" />

            {/* Border glow on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute -inset-px rounded-3xl bg-linear-to-br from-[#FF4D4D]/20 via-transparent to-purple-500/20 blur-sm" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full">{children}</div>
        </motion.div>
    );
};
