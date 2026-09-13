"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Code2, Menu, X } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

const navItems = [
    { label: "Accueil", href: "#accueil" },
    { label: "À propos", href: "#a-propos" },
    { label: "Services", href: "#services" },
    { label: "Projets", href: "#projets" },
    { label: "Tarifs", href: "#tarifs" },
];

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuTrigger = useRef<HTMLButtonElement>(null);
    const pathname = usePathname();
    const sectionHref = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

    useEffect(() => {
        const desktop = window.matchMedia("(min-width: 768px)");
        const closeOnDesktop = () => {
            if (desktop.matches) setMenuOpen(false);
        };
        desktop.addEventListener("change", closeOnDesktop);
        return () => desktop.removeEventListener("change", closeOnDesktop);
    }, []);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onKeyDown={(event) => {
                if (event.key === "Escape" && menuOpen) {
                    setMenuOpen(false);
                    menuTrigger.current?.focus();
                }
            }}
            className="bg-background/80 sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl"
        >
            <div className="mx-auto flex max-w-350 items-center justify-between px-6 py-4">
                {/* Logo */}
                <motion.a
                    id="site-top"
                    href={sectionHref("#accueil")}
                    onClick={() => setMenuOpen(false)}
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
                <nav
                    aria-label="Navigation principale"
                    className="hidden items-center gap-4 md:flex lg:gap-8"
                >
                    {navItems.map((item, index) => (
                        <motion.a
                            key={item.href}
                            href={sectionHref(item.href)}
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
                    className="shadow-glow-sm hover:shadow-glow-md hidden md:inline-flex"
                    asChild
                >
                    <a href={sectionHref("#contact")}>Let&apos;s Talk</a>
                </Button>
                <button
                    ref={menuTrigger}
                    type="button"
                    aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="focus-visible:ring-primary flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 focus-visible:ring-2 md:hidden"
                >
                    {menuOpen ? (
                        <X aria-hidden="true" className="size-5" />
                    ) : (
                        <Menu aria-hidden="true" className="size-5" />
                    )}
                </button>
            </div>
            <nav
                id="mobile-navigation"
                aria-label="Navigation mobile"
                hidden={!menuOpen}
                onBlur={(event) => {
                    if (
                        !event.currentTarget.contains(event.relatedTarget) &&
                        !menuTrigger.current?.contains(event.relatedTarget)
                    )
                        setMenuOpen(false);
                }}
                className="bg-background absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-white/10 px-6 py-4 shadow-2xl backdrop-blur-xl md:hidden"
            >
                <ul className="space-y-1">
                    {[...navItems, { label: "Contact", href: "#contact" }].map((item) => (
                        <li key={item.href}>
                            <a
                                href={sectionHref(item.href)}
                                onClick={() => setMenuOpen(false)}
                                className="hover:text-primary focus-visible:ring-primary flex min-h-12 items-center rounded-lg px-4 text-base text-gray-200 transition-colors hover:bg-white/5 focus-visible:ring-2 motion-reduce:transition-none"
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </motion.header>
    );
};
