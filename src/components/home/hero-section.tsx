"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

export const HeroSection = () => {
    return (
        <section id="accueil" className="py-12 md:py-20">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr,auto]">
                {/* Left Content */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="space-y-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
                        >
                            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                            <span className="text-sm text-gray-400">
                                Disponible pour de nouveaux projets
                            </span>
                        </motion.div>

                        <div className="space-y-2">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.5 }}
                                className="text-accent text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
                            >
                                Développeur
                            </motion.h1>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.6 }}
                                className="relative inline-block"
                            >
                                <h1 className="text-5xl font-bold tracking-tight text-primary md:text-7xl lg:text-8xl">
                                    Front-end
                                </h1>
                                <div className="absolute -inset-2 -z-10 bg-primary/10 blur-3xl" />
                            </motion.div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.7 }}
                            className="max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl"
                        >
                            Je transforme vos idées en expériences web exceptionnelles. Spécialisé
                            dans la création d&apos;interfaces modernes, performantes et
                            accessibles.
                        </motion.p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.8 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Button variant="primary" withGradient>
                            Démarrer un projet
                            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Button>

                        <Button variant="secondary">
                            Voir mes travaux
                        </Button>
                    </motion.div>
                </div>

                {/* Right Avatar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.9 }}
                    className="relative"
                >
                    <div className="relative mx-auto h-64 w-64 md:h-80 md:w-80">
                        {/* Glowing background */}
                        <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/30 to-purple-500/20 blur-3xl" />

                        {/* Avatar container */}
                        <div className="relative h-full w-full rounded-full bg-linear-to-br from-primary to-primary-light p-1">
                            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-secondary">
                                <div className="text-8xl">👨‍💻</div>
                            </div>
                        </div>

                        {/* Decorative badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-6 py-3 shadow-glow-md"
                        >
                            <span className="text-sm font-bold whitespace-nowrap">
                                I&apos;m Alexandre
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
