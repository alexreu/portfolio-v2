"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const BackHome = () => {
    const pathname = usePathname();

    if (pathname === "/") {
        return null;
    }

    return (
        <div>
            <Link
                href="/"
                className="group focus-visible:outline-primary mb-10 inline-flex gap-2 rounded-lg font-semibold text-white uppercase focus-visible:outline-2 focus-visible:outline-offset-4"
                aria-label="retourner à la page d'accueil"
            >
                <ArrowLeft className="group-hover:stroke-primary stroke-white transition-colors duration-300 ease-in-out" />
                <span className="group-hover:text-primary transition-colors duration-300 ease-in-out">
                    Back{" "}
                    <span className="text-primary transition-colors duration-300 ease-in-out group-hover:text-white">
                        home
                    </span>
                </span>
            </Link>
        </div>
    );
};
