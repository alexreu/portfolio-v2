"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export const BackHome = () => {
    const pathname = usePathname();

    if (pathname === "/") {
        return null;
    }

    return (
        <div>
            <Link
                href="/"
                className="group mb-10 inline-flex gap-2 rounded-lg font-semibold uppercase text-white
                    focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                aria-label="retourner à la page d'accueil"
            >
                <ArrowLeft className="stroke-white transition-colors duration-300 ease-in-out group-hover:stroke-primary" />
                <span className="transition-colors duration-300 ease-in-out group-hover:text-primary">
                    Back{" "}
                    <span className="text-primary transition-colors duration-300 ease-in-out group-hover:text-white">
                        home
                    </span>
                </span>
            </Link>
        </div>
    );
};
