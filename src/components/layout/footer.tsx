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
                    <div className="text-sm text-gray-500">
                        Copyright © 2026 AlexDevLab | Designed by{" "}
                        <span className="font-semibold text-primary">AlexDevLab</span>
                    </div>

                    {/* Footer Navigation */}
                    <nav className="flex items-center gap-6">
                        {["Accueil", "À propos", "Services", "Tarifs"].map((item) => (
                            <motion.a
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                                whileHover={{ y: -2 }}
                                className="text-sm text-gray-500 transition-colors hover:text-white"
                            >
                                {item}
                            </motion.a>
                        ))}
                    </nav>
                </div>
            </div>
        </motion.footer>
    );
};
