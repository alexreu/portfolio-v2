"use client";

import { Code2 } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

const navItems = [
    { label: "Accueil", href: "#accueil" },
    { label: "À propos", href: "#a-propos" },
    { label: "Services", href: "#services" },
    { label: "Tarifs", href: "#tarifs" },
];

export const Header = () => {
    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-background/80 sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl"
        >
            <div className="mx-auto flex max-w-350 items-center justify-between px-6 py-4">
                {/* Logo */}
                <motion.a
                    href="#accueil"
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2"
                >
                    <div className="relative">
                        <Code2 className="text-primary h-7 w-7" />
                        <div className="bg-primary/20 absolute -inset-1 -z-10 rounded-full blur-md" />
                    </div>
                    <span className="text-accent text-xl font-semibold tracking-tight">
                        AleX<span className="text-primary">Dev</span>Lab
                    </span>
                </motion.a>

                {/* Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item, index) => (
                        <motion.a
                            key={item.href}
                            href={item.href}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            whileHover={{ y: -2 }}
                            className="group relative text-sm text-gray-300 transition-colors hover:text-white"
                        >
                            {item.label}
                            <span className="bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full" />
                        </motion.a>
                    ))}
                </nav>

                {/* CTA Button */}
                <Button
                    variant="primary"
                    size="sm"
                    className="shadow-glow-sm hover:shadow-glow-md"
                    asChild
                >
                    <a href="#contact">Let&apos;s Talk</a>
                </Button>
            </div>
        </motion.header>
    );
};
