"use client";

import { motion } from "motion/react";

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
                        {[
                            { label: "Accueil", href: "#accueil" },
                            { label: "A propos", href: "#a-propos" },
                            { label: "Services", href: "#services" },
                            { label: "Tarifs", href: "#tarifs" },
                        ].map((item) => (
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
            </div>
        </motion.footer>
    );
};
