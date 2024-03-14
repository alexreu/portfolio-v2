import Link from "next/link";
import React from "react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    const navLinks = [
        { title: "Accueil", link: "/" },
        { title: "A propos", link: "/about" },
        { title: "Services", link: "/services" },
        { title: "Tarifs", link: "/pricing" },
    ];
    return (
        <footer className="mx-auto mt-20 flex items-center justify-between py-4 xl:mx-0">
            <p className="text-center font-medium text-white">
                Copyright © {currentYear} AlexDevLab | Designed By <span className="text-primary">AlexDevLab</span>
            </p>

            <ul className="hidden h-full gap-5 font-main text-base font-medium leading-3 text-white xl:flex">
                {navLinks.map(({ title, link }, i) => (
                    <li className="h-full" key={`${title}-${i}`}>
                        <Link href={link} className="transition-all duration-200 ease-in-out hover:text-primary">
                            {title}
                        </Link>
                    </li>
                ))}
            </ul>
        </footer>
    );
};
