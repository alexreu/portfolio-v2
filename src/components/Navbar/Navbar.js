import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { ThemeContext } from "../../modules/theme";
import styles from "./Navbar.module.css";
import { BurgerButton } from "../BurgerButton";
import { Button } from "../Button";

export const Navbar = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const [scroll, setScroll] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const scrollCheck = window.scrollY > 120;
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
    }, [scroll, openMenu]);

    const handleToggleMenu = () => {
        setOpenMenu(!openMenu);
        document.body.classList.toggle("fixed");
        document.body.classList.toggle("w-screen");
    };
    const navContent = [
        { label: "Accueil", icon: "house-door-fill", anchor: "home" },
        { label: "A propos", icon: "question-circle-fill", anchor: "about" },
        { label: "Diplômes", icon: "mortarboard-fill", anchor: "graduations" },
        { label: "Portfolio", icon: "award-fill", anchor: "portfolio" },
    ];
    const navList = navContent.map((navItem, index) => {
        const { anchor, label } = navItem;
        return (
            <li
                key={index}
                className={`${
                    scroll ? "text-black dark:lg:text-white" : "text-black dark:text-white lg:text-white"
                } lgd:py-2 lgd:w-full transition-200 duration-300 dark:hover:text-primary hover:text-primary lgd:border-b border-grey-light`}
            >
                <a
                    href={`#${anchor}`}
                    className="custom-underline inline-flex items-center h-full gap-x-4 font-medium text-base"
                >
                    <span>{label}</span>
                </a>
            </li>
        );
    });

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <header
            role="banner"
            className={`${
                scroll
                    ? `${styles.headerSticky} fixed top-0 bg-white dark:bg-primary-darkest shadow-lg`
                    : "absolute top-0 bg-transparent"
            } flex items-center justify-between z-[9999] w-full min-h-[64px] px-8 lg:px-16 transition-all duration-300 ease-in-out`}
        >
            <a href="#" className="inline-flex items-center">
                <Image src="/vercel.svg" alt="logo" width="170px" height="50px" />
                <span className="sr-only">retour en haut de la page</span>
            </a>
            <BurgerButton onClick={handleToggleMenu} style={scroll ? "text-black dark:text-white" : "text-white"} />
            <nav
                role="navigation"
                aria-label="navigation-principal"
                className={`${openMenu ? "lgd:w-screen lgd:translate-x-0" : "lgd:w-0 lgd:-translate-x-full"} ${
                    styles.mobilePopUp
                }`}
            >
                <ul className="flex lgd:flex-col lg:justify-end items-stretch lgd:gap-y-3 lg:gap-x-16 lgd:overflow-hidden lgd:bg-white lgd:dark:bg-primary-darkest lg:min-h-[64px] lgd:px-4 text-[22px] transition-200">
                    <li className="lg:hidden">
                        <Button
                            type="button"
                            style="flex items-center justify-center lg:hidden ml-auto"
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
                                scroll ? "text-black dark:text-white" : "text-black lgd:dark:text-white lg:text-white"
                            } inline-flex items-center justify-center h-10 w-10 bg-transparent rounded-full transition-200 hover:cursor-pointer hover:bg-[#9aa0a6]/[.157]`}
                        >
                            <i
                                className={`bi-${theme === "dark" ? "sun" : "moon"} font-medium text-lg transition-200`}
                            />
                        </Button>
                    </li>
                    <li className="inline-flex items-center">
                        <a
                            href="#contact"
                            className={`btn btn-default ${
                                scroll
                                    ? "text-grey-dark dark:text-white border-grey-light hover:text-white"
                                    : "text-grey-dark dark:text-white lg:text-white border-grey-light lg:border-[hsla(0,0%,100%,.2)]"
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
