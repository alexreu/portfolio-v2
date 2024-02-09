"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { BurgerButton } from "../BurgerButton";
import { Button } from "../Button";
import { MenuItem } from "../MenuItem";
import Link from "next/link";
import { useTheme } from "next-themes";
import Icon from "@mdi/react";
import { mdiWeatherNight, mdiLightbulbOnOutline,  mdiClose } from "@mdi/js";

const navContent = [
    { label: "Accueil", anchor: "home" },
    { label: "A propos", anchor: "about" },
    { label: "Services", anchor: "services" },
    { label: "Réalisations", anchor: "portfolio" },
];

export const Navbar = () => {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [scroll, setScroll] = useState<boolean>(false);
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const [underlineItem, setUnderlineItem] = useState<string | null>(null);

    useEffect(() => {
        theme ? setTheme(theme) : setTheme("light");

        const onScroll = () => {
            const scrollCheck = window.scrollY > 120;
            const visibleSection = navContent.find(section => {
                const bounding = document.querySelector(`section#${section.anchor}`)?.getClientRects();
                const bottom = bounding?.[0]?.bottom;

                if (bottom && bottom >= 64) {
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
    }, [scroll, openMenu, underlineItem, theme, setTheme]);

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
        setTheme(theme === "light" ? "dark" : "light");
    };

    const headerClasses = useMemo(() => {
        if(scroll || window.scrollY > 120) {
            return `${styles.headerSticky} fixed top-0 bg-white dark:bg-primary-darkest shadow-lg`
        } else {
            return `absolute top-0 ${pathname === "/" ? "bg-transparent" : "bg-white dark:bg-primary-darkest"}`
        }
    }, [pathname, scroll])

    const logoSrc =
        (scroll && theme === "light") || pathname !== "/"
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
                <span className="sr-only">retourner à accueil</span>
            </Link>
            <BurgerButton onClick={handleToggleMenu} className={burgerButtonClasses} />
            <nav role="navigation" aria-label="navigation-principal" className={`${navClasses} ${styles.mobilePopUp}`}>
                <ul
                    className="flex xld:flex-col xl:justify-end items-stretch xld:z-[9999] landscape:gap-y-1 xld:gap-y-3 xl:gap-x-16
                xld:overflow-hidden xl:px-4 xld:bg-white xld:dark:bg-primary-darkest xl:min-h-[64px] xld:px-4 text-[22px] transition-200"
                >
                    <li className="xl:hidden pt-3">
                        <Button
                            typeof="button"
                            className="flex items-center justify-center ml-auto p-1 rounded-full transition-all ease-in-out duration-200 hover:bg-[#9aa0a6]/[.157] focus-visible:bg-[#9aa0a6]/[.157] focus-visible:ring focus-visible:ring-primary focus-visible:outline-none"
                            onClick={handleToggleMenu}
                        >
                            <Icon path={mdiClose} size="24px" className="dark:fill-white" />
                            <span className="sr-only">fermer le menu mobile</span>
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
                            <span className="sr-only">
                                {theme === "light" ? "activer le theme sombre" : "activer le theme clair"}
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
