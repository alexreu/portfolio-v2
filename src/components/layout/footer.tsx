"use client";

import Link from "next/link";
import { motion } from "motion/react";

const navItems = [
    { label: "Accueil", href: "#accueil" },
    { label: "A propos", href: "#a-propos" },
    { label: "Services", href: "#services" },
    { label: "Tarifs", href: "#tarifs" },
];

const legalLinks = [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
    { label: "Cookies", href: "/politique-de-cookies" },
];

export const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="border-t border-white/5 bg-background/80 backdrop-blur-xl"
        >
            <div className="mx-auto max-w-350 px-6 py-8">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    {/* Copyright */}
                    <div className="text-sm text-gray-400">
                        Copyright © 2026 AlexDevLab | Designed by{" "}
                        <span className="font-semibold text-primary">AlexDevLab</span>
                    </div>

                    {/* Footer Navigation */}
                    <nav aria-label="Navigation pied de page" className="flex items-center gap-6">
                        {navItems.map((item) => (
                            <motion.a
                                key={item.href}
                                href={item.href}
                                whileHover={{ y: -2 }}
                                className="text-sm text-gray-400 transition-colors hover:text-white"
                            >
                                {item.label}
                            </motion.a>
                        ))}
                    </nav>
                </div>

                {/* Legal links */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-white/5 pt-6">
                    {legalLinks.map((item, index) => (
                        <span key={item.href} className="flex items-center gap-5">
                            <Link
                                href={item.href}
                                className="text-xs text-gray-500 transition-colors hover:text-gray-300"
                            >
                                {item.label}
                            </Link>
                            {index < legalLinks.length - 1 && (
                                <span className="hidden text-gray-700 sm:inline" aria-hidden="true">
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
