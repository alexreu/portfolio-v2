"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Code2, Menu, X } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** On the wedding page, "contact" means that page's own form. */
const contactItem = (tone: HeaderTone, sectionHref: (hash: string) => string) =>
    tone === "ivory"
        ? { label: "Parler de mon mariage", href: "#contact" }
        : { label: "Contact", href: sectionHref("#contact") };

const navItems = [
    { label: "Accueil", href: "#accueil" },
    { label: "À propos", href: "#a-propos" },
    { label: "Services", href: "#services" },
    { label: "Projets", href: "#projets" },
    { label: "Tarifs", href: "#tarifs" },
];

export type HeaderTone = "dark" | "ivory";

/** Class sets per surface: the wedding page frames its ivory content in ivory too. */
const toneStyles = {
    dark: {
        header: "bg-background/80 border-white/5",
        brand: "text-accent",
        logoMark: "text-primary",
        logoGlow: "bg-primary/20",
        link: "text-gray-300 hover:text-white",
        underline: "bg-primary",
        menuButton: "border-white/10 bg-white/5 text-white hover:bg-white/10",
        panel: "bg-background border-white/10",
        panelLink: "text-gray-200 hover:bg-white/5 hover:text-primary",
    },
    ivory: {
        header: "bg-wed-ivory/85 border-wed-line",
        brand: "text-wed-ink",
        logoMark: "text-wed-gold",
        logoGlow: "bg-wed-gold-soft/30",
        link: "text-wed-ink-soft hover:text-wed-ink",
        underline: "bg-wed-gold",
        menuButton: "border-wed-line bg-wed-paper text-wed-ink hover:bg-wed-line-soft",
        panel: "bg-wed-ivory border-wed-line",
        panelLink: "text-wed-ink-soft hover:bg-wed-paper hover:text-wed-ink",
    },
} as const satisfies Record<HeaderTone, Record<string, string>>;

type HeaderProps = {
    tone?: HeaderTone;
};

export const Header = ({ tone = "dark" }: HeaderProps) => {
    const styles = toneStyles[tone];
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
            className={cn("sticky top-0 z-50 border-b backdrop-blur-xl", styles.header)}
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
                        <Code2 className={cn("h-7 w-7", styles.logoMark)} />
                        <div
                            className={cn(
                                "absolute -inset-1 -z-10 rounded-full blur-md",
                                styles.logoGlow,
                            )}
                        />
                    </div>
                    <span className={cn("text-xl font-semibold tracking-tight", styles.brand)}>
                        AleX<span className={styles.logoMark}>Dev</span>Lab
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
                            className={cn("group relative text-sm transition-colors", styles.link)}
                        >
                            {item.label}
                            <span
                                className={cn(
                                    "absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full",
                                    styles.underline,
                                )}
                            />
                        </motion.a>
                    ))}
                </nav>

                {/* CTA Button */}
                {tone === "ivory" ? (
                    <a
                        href="#contact"
                        className="bg-wed-ink text-wed-paper hidden min-h-10 items-center rounded-sm px-4 text-sm font-medium transition-colors hover:bg-black md:inline-flex"
                    >
                        Parler de mon mariage
                    </a>
                ) : (
                    <Button
                        variant="primary"
                        size="sm"
                        className="shadow-glow-sm hover:shadow-glow-md hidden md:inline-flex"
                        asChild
                    >
                        <a href={sectionHref("#contact")}>Let&apos;s Talk</a>
                    </Button>
                )}
                <button
                    ref={menuTrigger}
                    type="button"
                    aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setMenuOpen((open) => !open)}
                    className={cn(
                        "focus-visible:ring-primary flex size-11 items-center justify-center rounded-xl border focus-visible:ring-2 md:hidden",
                        styles.menuButton,
                    )}
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
                className={cn(
                    "absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b px-6 py-4 shadow-2xl backdrop-blur-xl md:hidden",
                    styles.panel,
                )}
            >
                <ul className="space-y-1">
                    {[
                        ...navItems.map((item) => ({ ...item, href: sectionHref(item.href) })),
                        contactItem(tone, sectionHref),
                    ].map((item) => (
                        <li key={item.href}>
                            <a
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className={cn(
                                    "focus-visible:ring-primary flex min-h-12 items-center rounded-lg px-4 text-base transition-colors focus-visible:ring-2 motion-reduce:transition-none",
                                    styles.panelLink,
                                )}
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
