"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, Menu, X } from "lucide-react";

const sections = [
    { label: "L'expérience", href: "#experience" },
    { label: "Démo", href: "#demo" },
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    /** Who makes the site, on this page: the portfolio is linked from that section. */
    { label: "Qui suis-je", href: "#qui-suis-je" },
    { label: "Tarifs", href: "#tarifs" },
    { label: "FAQ", href: "#faq" },
] as const;

const Logo = () => (
    <a href="#mariage-titre" className="flex min-h-11 items-center gap-2.5">
        <span className="relative">
            <Code2 aria-hidden="true" className="text-wed-gold size-6" />
            <span className="bg-wed-gold-soft/30 absolute -inset-1 -z-10 rounded-full blur-md" />
        </span>
        <span className="text-wed-ink text-lg font-semibold tracking-tight">
            AleX<span className="text-wed-gold">Dev</span>Lab
        </span>
        <span className="border-wed-line text-wed-muted border-l pl-2.5 text-sm">Mariage</span>
    </a>
);

/** The wedding page's own navigation: its sections, who makes the site among them, and the call to action. */
export const WeddingHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuTrigger = useRef<HTMLButtonElement>(null);
    const close = () => setMenuOpen(false);

    useEffect(() => {
        const desktop = window.matchMedia("(min-width: 1024px)");
        const closeOnDesktop = () => desktop.matches && setMenuOpen(false);
        desktop.addEventListener("change", closeOnDesktop);
        return () => desktop.removeEventListener("change", closeOnDesktop);
    }, []);

    return (
        <header
            onKeyDown={(event) => {
                if (event.key === "Escape" && menuOpen) {
                    close();
                    menuTrigger.current?.focus();
                }
            }}
            className="bg-wed-ivory border-wed-line sticky top-0 z-50 border-b"
        >
            <div className="mx-auto flex h-18 max-w-300 items-center justify-between gap-6 px-6">
                <Logo />
                <nav aria-label="Sections de la page" className="hidden lg:block">
                    <ul className="flex gap-5 text-sm whitespace-nowrap xl:gap-7">
                        {sections.map((section) => (
                            <li key={section.href}>
                                <a
                                    href={section.href}
                                    className="text-wed-ink-soft hover:text-wed-ink"
                                >
                                    {section.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="hidden items-center gap-5 whitespace-nowrap lg:flex">
                    <a
                        href="#contact"
                        className="bg-wed-ink text-wed-paper inline-flex min-h-10 items-center rounded-sm px-4 text-sm font-medium transition-colors hover:bg-black"
                    >
                        Parler de mon mariage
                    </a>
                </div>
                <button
                    ref={menuTrigger}
                    type="button"
                    aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={menuOpen}
                    aria-controls="menu-mariage"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="border-wed-line bg-wed-paper text-wed-ink flex size-11 items-center justify-center rounded-md border lg:hidden"
                >
                    {menuOpen ? (
                        <X aria-hidden="true" className="size-5" />
                    ) : (
                        <Menu aria-hidden="true" className="size-5" />
                    )}
                </button>
            </div>
            <nav
                id="menu-mariage"
                aria-label="Menu de la page"
                hidden={!menuOpen}
                className="bg-wed-ivory border-wed-line shadow-wed-ink/10 absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b px-6 pt-2 pb-5 shadow-xl lg:hidden"
            >
                <ul>
                    {sections.map((section) => (
                        <li key={section.href}>
                            <a
                                href={section.href}
                                onClick={close}
                                className="text-wed-ink hover:bg-wed-paper flex min-h-12 items-center rounded-md px-3"
                            >
                                {section.label}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="border-wed-line mt-3 flex flex-col gap-3 border-t pt-4">
                    <a
                        href="#contact"
                        onClick={close}
                        className="bg-wed-ink text-wed-paper inline-flex min-h-12 items-center justify-center rounded-sm font-medium"
                    >
                        Parler de mon mariage
                    </a>
                </div>
            </nav>
        </header>
    );
};
