"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { getProjectUrl } from "@/lib/projects";
import type { Project } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/glass-card";

export const defaultProjects: Project[] = [
    {
        _id: "nexa",
        title: "Nexa",
        category: "Landing page · Démonstration SaaS",
        description:
            "Rendre l’automatisation accessible. Une vitrine pour un outil d’IA, pensée autour d’un parcours clair et d’une interface épurée.",
        url: "https://nexa-nu-two.vercel.app/",
        cover: {
            image: "/images/projects/nexa.webp",
            alt: "Page d’accueil Nexa, interface claire aux accents violets",
        },
        tags: ["Interface produit", "Responsive"],
        order: 0,
    },
    {
        _id: "anne-esthetik",
        title: "Anne Esthetik",
        category: "Site vitrine · Beauté & bien-être",
        description:
            "Transposer la douceur d’un institut de beauté à La Réunion. Un univers délicat pour découvrir les soins, consulter les tarifs et prendre contact.",
        url: "https://anne-esthetik.re",
        cover: {
            image: "/images/projects/anne-esthetik.webp",
            alt: "Page d’accueil Anne Esthétik, tons pastel et illustration florale",
        },
        tags: ["Identité visuelle", "Responsive"],
        order: 1,
    },
];

export function ProjectsSection({ projects }: { projects?: Project[] }) {
    const reducedMotion = useReducedMotion();
    const displayProjects = projects ?? defaultProjects;

    if (displayProjects.length === 0) return null;

    return (
        <GlassCard className="p-4 md:p-10" hoverScale={!reducedMotion}>
            <div className="mb-8 space-y-3 md:mb-10">
                <p className="text-primary text-sm font-semibold tracking-wider uppercase">
                    Mes projets{" "}
                    <span className="ml-3 text-gray-400">
                        / {String(displayProjects.length).padStart(2, "0")}
                    </span>
                </p>
                <h2 id="projects-heading" className="text-accent text-2xl font-bold md:text-4xl">
                    Des idées. <span className="text-primary">Du concret.</span>
                </h2>
                <p className="text-lg text-gray-300">
                    Une sélection d’interfaces conçues pour faire la différence.
                </p>
            </div>
            <div className="space-y-6 md:space-y-8">
                {displayProjects.map((project, index) => {
                    const href = getProjectUrl(project.url);
                    return (
                        <motion.article
                            key={project._id}
                            initial={false}
                            whileInView={reducedMotion ? undefined : { y: [16, 0] }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                            className={cn(
                                "group/project focus-within:border-primary/50 grid items-center gap-6 rounded-3xl border border-white/10 bg-white/2 p-4 transition-colors duration-300 hover:border-white/20 motion-reduce:transition-none md:grid-cols-[1.2fr_1fr] md:gap-8 md:p-6 lg:gap-12 lg:p-8",
                                index % 2 === 1 && "md:grid-cols-[1fr_1.2fr]",
                            )}
                        >
                            <div
                                className={cn(
                                    "relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/10 to-white/2 p-3 md:p-5",
                                    index % 2 === 1 && "md:order-2",
                                )}
                            >
                                <div aria-hidden="true" className="mb-3 flex items-center gap-1.5">
                                    <span className="bg-primary/80 size-1.5 rounded-full" />
                                    <span className="size-1.5 rounded-full bg-white/20" />
                                    <span className="size-1.5 rounded-full bg-white/20" />
                                    <span className="ml-auto text-[10px] tracking-widest text-gray-400 uppercase">
                                        Aperçu du site
                                    </span>
                                </div>
                                <div className="bg-background relative aspect-video overflow-hidden rounded-lg shadow-2xl motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-focus-within/project:scale-[1.025] motion-safe:group-hover/project:scale-[1.025]">
                                    {project.cover?.image ? (
                                        <Image
                                            src={project.cover.image}
                                            alt={
                                                project.cover.alt ||
                                                `Aperçu du projet ${project.title}`
                                            }
                                            fill
                                            sizes="(max-width: 767px) calc(100vw - 110px), (max-width: 1400px) 48vw, 640px"
                                            className="object-cover object-top"
                                        />
                                    ) : (
                                        <div
                                            aria-hidden="true"
                                            className="from-primary/15 flex h-full items-center justify-center bg-linear-to-br to-purple-500/10 p-6 text-center text-3xl font-semibold tracking-tight text-white/80"
                                        >
                                            {project.title}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="min-w-0 px-1 py-2 md:px-0 md:py-4">
                                <p className="mb-4 flex items-center gap-3 text-[11px] font-medium tracking-widest text-gray-400 uppercase">
                                    <span className="text-primary">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="h-px w-6 bg-white/20" aria-hidden="true" />
                                    {project.category}
                                </p>
                                <h3 className="text-accent text-3xl font-semibold tracking-tight break-words lg:text-4xl">
                                    {project.title}
                                </h3>
                                <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-300">
                                    {project.description}
                                </p>
                                {!!project.tags?.length && (
                                    <ul
                                        aria-label="Caractéristiques du projet"
                                        className="mt-5 flex flex-wrap gap-2"
                                    >
                                        {project.tags.map((tag) => (
                                            <li
                                                key={tag}
                                                className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-gray-300"
                                            >
                                                {tag}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {href && (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="decoration-primary/70 hover:text-primary focus-visible:text-primary focus-visible:ring-primary focus-visible:ring-offset-background mt-6 inline-flex min-h-11 items-center gap-3 rounded-sm text-sm font-medium text-white underline underline-offset-8 transition-colors focus-visible:ring-2 focus-visible:ring-offset-4 motion-reduce:transition-none"
                                    >
                                        Découvrir le projet
                                        <span className="sr-only">
                                            {" "}
                                            {project.title} (nouvel onglet)
                                        </span>
                                        <ArrowUpRight aria-hidden="true" className="size-4" />
                                    </a>
                                )}
                            </div>
                        </motion.article>
                    );
                })}
            </div>
        </GlassCard>
    );
}
