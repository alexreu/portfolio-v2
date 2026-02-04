"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import type { SiteSettings } from "@/lib/sanity/types";
import { Button } from "@/components/ui/button";

type HeroData = SiteSettings["hero"];

type HeroSectionProps = {
    data?: HeroData | null;
};

// Default values when Sanity data is not available
const defaultData: HeroData = {
    name: "Alexandre",
    title: "Développeur",
    subtitle: "Front-end",
    description:
        "Je transforme vos idées en expériences web exceptionnelles. Spécialisé dans la création d'interfaces modernes, performantes et accessibles.",
    availabilityText: "Disponible pour de nouveaux projets",
    ctaPrimary: { text: "Démarrer un projet", href: "#contact" },
    ctaSecondary: { text: "Voir mes travaux", href: "#services" },
};

export const HeroSection = ({ data }: HeroSectionProps) => {
    const hero = { ...defaultData, ...data };

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
                        {hero.availabilityText && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm"
                            >
                                <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
                                <span className="text-sm text-gray-300">
                                    {hero.availabilityText}
                                </span>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.5 }}
                                className="text-accent text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
                            >
                                {hero.title}
                            </motion.h1>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.6 }}
                                className="relative inline-block"
                            >
                                <h1 className="text-primary text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
                                    {hero.subtitle}
                                </h1>
                                <div className="bg-primary/10 absolute -inset-2 -z-10 blur-3xl" />
                            </motion.div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.7 }}
                            className="max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl"
                        >
                            {hero.description}
                        </motion.p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.8 }}
                        className="flex flex-wrap gap-4"
                    >
                        {hero.ctaPrimary && (
                            <Button variant="primary" withGradient asChild>
                                <a href={hero.ctaPrimary.href}>
                                    {hero.ctaPrimary.text}
                                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </a>
                            </Button>
                        )}

                        {/* Disable this for now */}
                        {/*{hero.ctaSecondary && (
                            <Button variant="secondary" asChild>
                                <a href={hero.ctaSecondary.href}>{hero.ctaSecondary.text}</a>
                            </Button>
                        )}*/}
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
                        <div className="from-primary/30 absolute inset-0 rounded-full bg-linear-to-br to-purple-500/20 blur-3xl" />

                        {/* Avatar container */}
                        <div className="from-primary to-primary-light relative h-full w-full rounded-full bg-linear-to-br p-1">
                            <div className="bg-secondary flex h-full w-full items-center justify-center overflow-hidden rounded-full">
                                {hero.profileImage?.image ? (
                                    <Image
                                        src={hero.profileImage.image}
                                        alt={hero.profileImage.alt || hero.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="text-8xl" aria-label={hero.name}>
                                        👨‍💻
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Decorative badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                            className="bg-primary shadow-glow-md absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full px-6 py-3"
                        >
                            <span className="text-sm font-bold whitespace-nowrap">
                                I&apos;m {hero.name}
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
