"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MoveUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
    const [sheetOpen, setSheetOpen] = useState(false);

    const navLinks = [
        { title: "Accueil", link: "/" },
        { title: "A propos", link: "/about" },
        { title: "Services", link: "/services" },
        { title: "Tarifs", link: "/pricing" },
    ];

    return (
        <header role="banner">
            <nav className="bg-card mb-10 flex w-full items-center justify-between rounded-xl px-8 py-3 opacity-100 backdrop-blur-xl">
                <Link
                    href="/"
                    className="text-primary relative z-40 rounded-xl font-bold"
                    aria-label="retourner à la page d'accueil"
                >
                    <Image
                        src="/images/logo-text-white.png"
                        alt="AlexDevLab logo"
                        width={110}
                        height={100}
                        priority
                    />
                </Link>
                <ul className="font-main hidden h-full gap-8 text-base leading-3 font-medium text-white xl:flex">
                    {navLinks.map(({ title, link }, i) => (
                        <li className="h-full" key={`${title}-${i}`}>
                            <Link
                                href={link}
                                className="transition-color hover:text-primary rounded-lg duration-200 ease-in-out"
                            >
                                {title}
                            </Link>
                        </li>
                    ))}
                </ul>
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger
                        className="text-white xl:hidden"
                        aria-label="Ouvrir le menu mobile"
                    >
                        <Menu size={32} className="stroke-white" />
                    </SheetTrigger>
                    <SheetContent side="right">
                        <ul className="font-main mt-8 flex flex-col gap-5 text-base leading-3 font-medium text-white">
                            {navLinks.map(({ title, link }, i) => (
                                <li className="rounded-lg p-2" key={`${title}-${i}`}>
                                    <Link
                                        href={link}
                                        className="hover:text-primary transition-all duration-200 ease-in-out"
                                        onClick={() => setSheetOpen(false)}
                                    >
                                        {title}
                                    </Link>
                                </li>
                            ))}
                            <li className="p-2">
                                <Button className="inline-flex gap-2 rounded-full" asChild>
                                    <Link href="/contact" onClick={() => setSheetOpen(false)}>
                                        Let&#39;s Talk
                                        <MoveUpRight size={18} strokeWidth={3} />
                                    </Link>
                                </Button>
                            </li>
                        </ul>
                    </SheetContent>
                </Sheet>
                <Button
                    className="focus-visible:outline-primary hidden gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 xl:inline-flex"
                    asChild
                >
                    <Link href="/contact" aria-label="formulaire de contact">
                        Let&#39;s Talk
                        <MoveUpRight size={18} strokeWidth={3} />
                    </Link>
                </Button>
            </nav>
        </header>
    );
};
