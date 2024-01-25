"use client";

import { useState, useEffect, createContext, FC, ReactNode } from "react";

interface ThemeContextProps {
    theme: string;
    setTheme: (theme: string) => void;
}

interface ThemeProviderProps {
    initialTheme: string;
    children: ReactNode;
}

export const getInitialTheme = () => {
    if (typeof window !== "undefined") {
        const storedPrefs = window.localStorage.getItem("color-theme");
        return typeof storedPrefs === "string"
            ? storedPrefs
            : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }
    return "light";
};

export const ThemeContext = createContext<ThemeContextProps>({
    theme: "light",
    setTheme: () => "light",
});

export const ThemeProvider: FC<ThemeProviderProps> = ({ initialTheme, children }) => {
    const [theme, setTheme] = useState(() => getInitialTheme());

    const rawSetTheme = (rawTheme: string) => {
        const root = document.documentElement;
        const isDark = rawTheme === "dark";

        root.classList.remove(isDark ? "light" : "dark");
        root.classList.add(rawTheme);

        localStorage.setItem("color-theme", rawTheme);
    };

    useEffect(() => {
        rawSetTheme(theme);
    }, [theme]);

    useEffect(() => {
        if (initialTheme) {
            rawSetTheme(initialTheme);
        }
    }, [initialTheme]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
