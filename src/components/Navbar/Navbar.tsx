"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ThemeContext } from "../../modules/theme";
import styles from "./Navbar.module.css";
import { BurgerButton } from "../BurgerButton";
import { Button } from "../Button";
import { MenuItem } from "../MenuItem";
import Link from "next/link";
import { useTheme } from "next-themes";
import Icon from "@mdi/react";
import { mdiWeatherNight, mdiLightbulbOnOutline } from "@mdi/js";

const navContent = [
    { label: "Accueil", anchor: "home" },
    { label: "A propos", anchor: "about" },
    { label: "Services", anchor: "services" },
    { label: "Réalisations", anchor: "portfolio" },
];

export const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [scroll, setScroll] = useState<boolean>(false);
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const [underlineItem, setUnderlineItem] = useState<string | null>(null);
    const [colorTheme, setColorTheme] = useState<string>("dark");

    useEffect(() => {
        setColorTheme(theme);
        const onScroll = () => {
            const scrollCheck = window.scrollY > 120;
            const visibleSection = navContent.find(section => {
                const bounding = document.querySelector(`section#${section.anchor}`)?.getClientRects();
                const bottom = bounding?.[0]?.bottom;

                if (bottom >= 64) {
                    return section;
                }
            });
            if (window.innerWidth >= 1024 && visibleSection) {
                setUnderlineItem(visibleSection.anchor);
            }

            if (scrollCheck !== scroll) {
                setScroll(scrollCheck);
            }
        };

        const onWindowResize = () => {
            if (window.innerWidth >= 1024) {
                setOpenMenu(false);
            }
        };

        document.addEventListener("scroll", onScroll);
        window.addEventListener("resize", onWindowResize);

        return () => {
            document.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onWindowResize);
        };
    }, [scroll, openMenu, underlineItem, theme]);

    const handleToggleMenu = () => {
        const {
            body: { classList },
        } = document;
        setOpenMenu(!openMenu);
        if (classList.contains("overflow-hidden")) {
            classList.remove("overflow-hidden");
        } else {
            classList.add("overflow-hidden");
        }
    };

    const handleMenuItemClick = () => {
        if (window.innerWidth < 1170) {
            setOpenMenu(!openMenu);
            document.body.classList.remove("overflow-hidden");
        }
    };

    const toggleTheme = () => {
        setColorTheme(theme === "light" ? "dark" : "light");
        setTheme(theme === "light" ? "dark" : "light");
    };

    const headerClasses = scroll
        ? `${styles.headerSticky} fixed top-0 bg-white dark:bg-primary-darkest shadow-lg`
        : `absolute top-0 ${pathname === "/" ? "bg-transparent" : "bg-white dark:bg-primary-darkest"}`;

    const logoSrc =
        (scroll && colorTheme === "light") || pathname !== "/"
            ? "/images/logo-text-dark.png"
            : "/images/logo-text-white.png";

    const burgerButtonClasses = scroll ? "text-black dark:text-white" : "text-white";
    const navClasses = openMenu ? "xld:w-screen xld:translate-x-0" : "xld:w-0 xld:-translate-x-full";
    const toggleThemeClasses = scroll
        ? "text-black dark:text-white"
        : `text-black xld:dark:text-white ${pathname === "/" ? "xl:text-white" : "xl:text-black xl:dark:text-white"}`;

    return (
        <header
            role="banner"
            className={`${headerClasses} flex items-center justify-between z-[9999] w-full min-h-[64px] px-8 xl:px-16 transition-all duration-300 ease-in-out`}
        >
            <Link href="/#home" className="inline-flex items-center">
                <Image src={logoSrc} alt="logo" width={scroll ? 120 : 140} height={scroll ? 60 : 80} />
                <span className="sr-only">retour en haut de la page</span>
            </Link>
            <BurgerButton onClick={handleToggleMenu} className={burgerButtonClasses} />
            <nav role="navigation" aria-label="navigation-principal" className={`${navClasses} ${styles.mobilePopUp}`}>
                <ul
                    className="flex xld:flex-col xl:justify-end items-stretch xld:z-[9999] landscape:gap-y-1 xld:gap-y-3 xl:gap-x-16
                xld:overflow-hidden xl:px-4 xld:bg-white xld:dark:bg-primary-darkest xl:min-h-[64px] xld:px-4 text-[22px] transition-200"
                >
                    <li className="xl:hidden">
                        <Button
                            typeof="button"
                            className="flex items-center justify-center xl:hidden ml-auto"
                            onClick={handleToggleMenu}
                        >
                            <i className="bi bi-x text-[35px] dark:text-white" />
                        </Button>
                    </li>
                    {navContent.map(navItem => {
                        const { anchor, label } = navItem;
                        return (
                            <MenuItem
                                onClick={handleMenuItemClick}
                                anchor={anchor}
                                label={label}
                                scroll={scroll}
                                key={anchor}
                                pathName={pathname as string}
                                isUnderline={anchor !== "home" && anchor === underlineItem}
                            />
                        );
                    })}
                    <li className="inline-flex items-center">
                        <Button
                            onClick={toggleTheme}
                            typeof="button"
                            className={`${toggleThemeClasses} inline-flex items-center justify-center h-10 w-10 bg-transparent rounded-full transition-200 
                            hover:cursor-pointer hover:bg-[#9aa0a6]/[.157] focus:cursor-pointer focus:bg-[#9aa0a6]/[.157]`}
                        >
                            {theme === "light" ? (
                                <Icon path={mdiWeatherNight} size={1} />
                            ) : (
                                <Icon path={mdiLightbulbOnOutline} size={1} />
                            )}

                            <i
                                className={`bi-${
                                    colorTheme === "dark" ? "sun" : "moon-stars"
                                } font-medium text-lg transition-200`}
                            />
                            <span className="sr-only">
                                {colorTheme === "dark" ? "activer le theme clair" : "activer le theme sombre"}
                            </span>
                        </Button>
                    </li>
                    <li className="inline-flex items-center">
                        <Link
                            href="/#contact"
                            onClick={handleMenuItemClick}
                            className={`btn btn-default ${
                                scroll
                                    ? "text-grey-dark dark:text-white border-grey-light hover:text-white dark:hover:text-white focus:text-white dark:focus:text-white"
                                    : `text-grey-dark dark:text-white ${
                                          pathname === "/" ? "xl:text-white" : "xl:text-dark"
                                      } border-grey-light ${
                                          pathname === "/" ? "xl:border-[hsla(0,0%,100%,.2)]" : "xl:border-grey-light"
                                      }`
                            }`}
                        >
                            Contact
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};
