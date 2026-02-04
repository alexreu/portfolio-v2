import { ArrowUpRight, Lightbulb, User } from "lucide-react";
import { motion } from "motion/react";

import { GlassCard } from "../shared/glass-card";
import { Button } from "../ui/button";

export const AboutCard = () => {
    return (
        <GlassCard className="h-full p-8 md:p-10">
            <div className="flex h-full flex-col space-y-8">
                <div className="space-y-4">
                    <span className="text-primary text-sm font-semibold tracking-wider uppercase">
                        Qui suis-je
                    </span>
                    <h2 className="text-accent text-3xl font-bold md:text-4xl">
                        Développeur Front-End passionné par{" "}
                        <span className="text-primary">l&apos;excellence web </span> ⚡️
                    </h2>
                    <p className="text-lg text-gray-400">
                        5 ans d&apos;expérience en React, Next.js et TypeScript
                    </p>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ease: "easeInOut" }}
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
                                    <Lightbulb className="text-primary h-7 w-7" />
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-accent group-hover/service:text-primary text-xl font-bold transition-colors duration-300">
                                Mon Approche
                            </h3>

                            {/* Description */}
                            <p className="text-base leading-relaxed">
                                Code maintenable, performances optimales, communication
                                transparente. Chaque site bénéficie d&apos;un hébergement optimisé
                                et d&apos;un suivi technique inclus.
                            </p>
                        </div>

                        {/* Corner accent */}
                        <div className="bg-primary absolute top-4 right-4 h-2 w-2 rounded-full opacity-0 transition-opacity duration-300 group-hover/service:opacity-100" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ease: "easeInOut", duration: 0.3 }}
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
                                    <User className="text-primary h-7 w-7" />
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-accent group-hover/service:text-primary text-xl font-bold transition-colors duration-300">
                                Pour qui ?
                            </h3>

                            {/* Description */}
                            <p className="text-base leading-relaxed">
                                Entrepreneurs et entreprises qui veulent une présence en ligne
                                rapide (offre Starter) ou une application web sur-mesure. Prêt à
                                donner vie à votre projet ? Discutons-en.
                            </p>
                        </div>

                        {/* Corner accent */}
                        <div className="bg-primary absolute top-4 right-4 h-2 w-2 rounded-full opacity-0 transition-opacity duration-300 group-hover/service:opacity-100" />
                    </motion.div>
                </div>
                <Button variant="primary" className="mx-auto" asChild>
                    <a href="#contact">
                        Discutons-en
                        <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                </Button>
            </div>
        </GlassCard>
    );
};
