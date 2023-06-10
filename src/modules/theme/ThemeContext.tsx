import { useState, useEffect, createContext, FC, ReactNode } from "react";


interface ThemeContextProps {
    theme: string;
    setTheme: (theme: string) => void | null;
}

interface ThemeProviderProps {
    initialTheme: string;
    children: ReactNode;
}
export const getInitialTheme = () => {
    if (typeof window === "object") {
        const storedPrefs = window?.localStorage.getItem("color-theme");

        if (typeof storedPrefs === "string") {
            return storedPrefs;
        }
        const userMedia = window.matchMedia("(prefers-color-scheme: dark)");

        if (userMedia.matches) {
            return "dark";
        }

        return "light";
    }
};

export const ThemeContext = createContext<ThemeContextProps>({theme: getInitialTheme(), setTheme: null});

export const ThemeProvider: FC<ThemeProviderProps> = ({ initialTheme, children }) => {
    const [theme, setTheme] = useState(getInitialTheme);

    const rawSetTheme = rawTheme => {
        const root = window.document.documentElement;
        const isDark = rawTheme === "dark";

        root.classList.remove(isDark ? "light" : "dark");
        root.classList.add(rawTheme);

        localStorage.setItem("color-theme", rawTheme);
    };

    if (initialTheme) {
        rawSetTheme(initialTheme);
    }

    useEffect(() => {
        rawSetTheme(theme);
    }, [theme]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
