"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { CurrentYear } from "./current-year";

const navItems = [
    { label: "Accueil", href: "#accueil" },
    { label: "À propos", href: "#a-propos" },
    { label: "Services", href: "#services" },
    { label: "Projets", href: "#projets" },
    { label: "Tarifs", href: "#tarifs" },
];

const legalLinks = [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
    { label: "Cookies", href: "/politique-de-cookies" },
];

export type FooterTone = "dark" | "ivory";

/** Class sets per surface: the wedding page closes on paper, not on the dark portfolio. */
const toneStyles = {
    dark: {
        footer: "bg-background/80 border-white/5",
        text: "text-gray-400",
        signature: "text-primary",
        link: "text-gray-400 hover:text-white",
        divider: "border-white/5",
        legalLink: "text-gray-500 hover:text-gray-300",
        dot: "text-gray-700",
    },
    ivory: {
        footer: "bg-wed-paper border-wed-line",
        text: "text-wed-muted",
        signature: "text-wed-gold",
        link: "text-wed-muted hover:text-wed-ink",
        divider: "border-wed-line",
        legalLink: "text-wed-muted hover:text-wed-ink",
        dot: "text-wed-line",
    },
} as const satisfies Record<FooterTone, Record<string, string>>;

type FooterProps = {
    renderedYear: number;
    tone?: FooterTone;
};

export const Footer = ({ renderedYear, tone = "dark" }: FooterProps) => {
    const styles = toneStyles[tone];
    const pathname = usePathname();
    const sectionHref = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className={cn("border-t backdrop-blur-xl", styles.footer)}
        >
            <div className="mx-auto max-w-350 px-6 py-8">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    {/* Copyright */}
                    <div className={cn("text-center text-sm md:text-left", styles.text)}>
                        Copyright © <CurrentYear renderedYear={renderedYear} /> AlexDevLab |
                        Designed by{" "}
                        <span className={cn("font-semibold", styles.signature)}>AlexDevLab</span>
                    </div>

                    {/* Footer Navigation */}
                    <nav
                        aria-label="Navigation pied de page"
                        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
                    >
                        {navItems.map((item) => (
                            <motion.a
                                key={item.href}
                                href={sectionHref(item.href)}
                                whileHover={{ y: -2 }}
                                className={cn("text-sm transition-colors", styles.link)}
                            >
                                {item.label}
                            </motion.a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Legal links — full-width border */}
            <div className={cn("border-t", styles.divider)}>
                <div className="mx-auto flex max-w-350 flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 py-6">
                    {legalLinks.map((item, index) => (
                        <span key={item.href} className="flex items-center gap-5">
                            <Link
                                href={item.href}
                                className={cn("text-xs transition-colors", styles.legalLink)}
                            >
                                {item.label}
                            </Link>
                            {index < legalLinks.length - 1 && (
                                <span
                                    className={cn("hidden sm:inline", styles.dot)}
                                    aria-hidden="true"
                                >
                                    ·
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            </div>
        </motion.footer>
    );
};
