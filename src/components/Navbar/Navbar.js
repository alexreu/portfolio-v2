import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ThemeContext } from "../../modules/theme";
import styles from "./Navbar.module.css";
import { BurgerButton } from "../BurgerButton";
import { Button } from "../Button";
import { MenuItem } from "../MenuItem";
import Link from "next/link";

const navContent = [
    { label: "Accueil", anchor: "home" },
    { label: "A propos", anchor: "about" },
    { label: "Services", anchor: "services" },
    { label: "Réalisations", anchor: "portfolio" },
];

export const Navbar = () => {
    const { pathname } = useRouter();
    const { theme, setTheme } = useContext(ThemeContext);
    const [scroll, setScroll] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [underlineItem, setUnderlineItem] = useState(null);
    const [colorTheme, setColorTheme] = useState("dark");

    useEffect(() => {
        setColorTheme(theme);
        const onScroll = () => {
            const scrollCheck = window.scrollY > 120;
            const visibleSection = navContent.find(section => {
                const bounding = document.querySelector(`section#${section.anchor}`)?.getClientRects();
                const [{ bottom }] = bounding ?? [{}];
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
    }, [scroll, openMenu, underlineItem]);

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

    const navList = navContent.map(navItem => {
        const { anchor, label } = navItem;
        return (
            <MenuItem
                onClick={handleMenuItemClick}
                anchor={anchor}
                label={label}
                scroll={scroll}
                key={anchor}
                pathName={pathname}
                isUnderline={anchor !== "home" && anchor === underlineItem}
            />
        );
    });

    const toggleTheme = () => {
        setColorTheme(theme === "light" ? "dark" : "light");
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <header
            role="banner"
            className={`${
                scroll
                    ? `${styles.headerSticky} fixed top-0 bg-white dark:bg-primary-darkest shadow-lg`
                    : `absolute top-0 ${pathname === "/" ? "bg-transparent" : "bg-white dark:bg-primary-darkest"}`
            } flex items-center justify-between z-[9999] w-full min-h-[64px] px-8 xl:px-16 transition-all duration-300 ease-in-out`}
        >
            <Link href="/#home" passHref>
                <a className="inline-flex items-center">
                    <Image
                        src={
                            (scroll && colorTheme === "light") || pathname !== "/"
                                ? "/images/logo-text-dark.png"
                                : "/images/logo-text-white.png"
                        }
                        alt="logo"
                        width={scroll ? "120px " : "140px"}
                        height={scroll ? "60px " : "80px"}
                    />
                    <span className="sr-only">retour en haut de la page</span>
                </a>
            </Link>
            <BurgerButton onClick={handleToggleMenu} style={scroll ? "text-black dark:text-white" : "text-white"} />
            <nav
                role="navigation"
                aria-label="navigation-principal"
                className={`${openMenu ? "xld:w-screen xld:translate-x-0" : "xld:w-0 xld:-translate-x-full"} ${
                    styles.mobilePopUp
                }`}
            >
                <ul
                    className="flex xld:flex-col xl:justify-end items-stretch xld:z-[9999] landscape:gap-y-1 xld:gap-y-3 xl:gap-x-16
                xld:overflow-hidden xl:px-4 xld:bg-white xld:dark:bg-primary-darkest xl:min-h-[64px] xld:px-4 text-[22px] transition-200"
                >
                    <li className="xl:hidden">
                        <Button
                            type="button"
                            style="flex items-center justify-center xl:hidden ml-auto"
                            onClick={handleToggleMenu}
                        >
                            <i className="bi bi-x text-[35px] dark:text-white" />
                        </Button>
                    </li>
                    {navList}
                    <li className="inline-flex items-center">
                        <Button
                            onClick={toggleTheme}
                            type="button"
                            style={`${
                                scroll
                                    ? "text-black dark:text-white"
                                    : `text-black xld:dark:text-white ${
                                          pathname === "/" ? "xl:text-white" : "xl:text-black xl:dark:text-white"
                                      }`
                            } inline-flex items-center justify-center h-10 w-10 bg-transparent rounded-full transition-200 
                            hover:cursor-pointer hover:bg-[#9aa0a6]/[.157] focus:cursor-pointer focus:bg-[#9aa0a6]/[.157]`}
                        >
                            <i
                                className={`bi-${
                                    colorTheme === "dark" ? "sun" : "moon-stars"
                                } font-medium text-lg transition-200`}
                            />
                            <span className="sr-only">
                                {colorTheme === "dark" ? "activer le theme clair" : "activer le theme fonce"}
                            </span>
                        </Button>
                    </li>
                    <li className="inline-flex items-center">
                        <a
                            href="#contact"
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
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};
