"use client";

import { motion } from "motion/react";

import { GlassCard } from "../GlassCard";

const topSkills = ["TailwindCSS", "TypeScript", "Sanity", "NextJ"];

const skills = [
    { name: "React", icon: "⚛️" },
    { name: "CSS3", icon: "🎨" },
    { name: "JavaScript", icon: "⚡" },
    { name: "HTML5", icon: "📄" },
    { name: "Node.js", icon: "🟢" },
    { name: "Git", icon: "📦" },
    { name: "Figma", icon: "🎯" },
    { name: "Webpack", icon: "📦" },
    { name: "VS Code", icon: "💻" },
    { name: "Docker", icon: "🐳" },
    { name: "API", icon: "🔌" },
    { name: "npm", icon: "📦" },
];

export const SkillsCard = () => {
    return (
        <GlassCard className="h-full p-8" hoverScale={false}>
            <div className="flex h-full flex-col space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <span className="text-sm font-semibold tracking-wider text-[#FF4D4D] uppercase">
                        Skills & tools
                    </span>
                </div>

                {/* Top Skills Pills */}
                <div className="flex flex-wrap gap-2">
                    {topSkills.map((skill, index) => (
                        <motion.div
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="rounded-full border border-[#FF4D4D]/30 bg-[#FF4D4D]/10 px-4 py-2 text-sm font-medium text-[#FF4D4D] transition-colors duration-300 hover:border-[#FF4D4D]/50 hover:bg-[#FF4D4D]/20"
                        >
                            {skill}
                        </motion.div>
                    ))}
                </div>

                {/* Skills Grid */}
                <div className="grid flex-1 grid-cols-6 gap-3">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.05 + 0.3,
                                duration: 0.3,
                            }}
                            whileHover={{ scale: 1.1, y: -4 }}
                            className="group/icon relative flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-white/5 bg-white/3 transition-colors duration-300 hover:border-[#FF4D4D]/30 hover:bg-white/6"
                            title={skill.name}
                        >
                            <div className="absolute inset-0 rounded-xl bg-[#FF4D4D]/0 transition-colors duration-300 group-hover/icon:bg-[#FF4D4D]/5" />

                            <span className="relative z-10 text-2xl">{skill.icon}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
};
