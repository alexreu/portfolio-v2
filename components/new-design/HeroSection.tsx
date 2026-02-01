"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export const HeroSection = () => {
    return (
        <section className="py-12 md:py-20">
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
                            <div className="h-2 w-2 animate-pulse rounded-full bg-[#FF4D4D]" />
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
                                <h1 className="text-5xl font-bold tracking-tight text-[#FF4D4D] md:text-7xl lg:text-8xl">
                                    Front-end
                                </h1>
                                <div className="absolute -inset-2 -z-10 bg-[#FF4D4D]/10 blur-3xl" />
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
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative overflow-hidden rounded-full bg-[#FF4D4D] px-8 py-4 font-semibold text-white shadow-[0_0_30px_rgba(255,77,77,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,77,77,0.6)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Démarrer un projet
                                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </span>
                            <div className="absolute inset-0 bg-linear-to-r from-[#FF4D4D] to-[#ff6b6b] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="rounded-full border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                        >
                            Voir mes travaux
                        </motion.button>
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
                        <div className="absolute inset-0 rounded-full bg-linear-to-br from-[#FF4D4D]/30 to-purple-500/20 blur-3xl" />

                        {/* Avatar container */}
                        <div className="relative h-full w-full rounded-full bg-linear-to-br from-[#FF4D4D] to-[#ff6b6b] p-1">
                            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#1a1a1a]">
                                <div className="text-8xl">👨‍💻</div>
                            </div>
                        </div>

                        {/* Decorative badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[#FF4D4D] px-6 py-3 shadow-[0_0_30px_rgba(255,77,77,0.5)]"
                        >
                            <span className="text-sm font-bold whitespace-nowrap">
                                I'm Alexandre
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
