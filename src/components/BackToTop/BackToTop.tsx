"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

export const BackToTop = () => {
    const [showBackToTopButton, setShowBackToTopButton] = useState(false);

    useEffect(() => {
        document.addEventListener("scroll", () => {
            const scrollCheck = window.scrollY > 120;
            if (scrollCheck !== showBackToTopButton) setShowBackToTopButton(scrollCheck);
        });

        return () => {
            document.removeEventListener("scroll", () => {
                const scrollCheck = window.scrollY > 120;
                if (scrollCheck !== showBackToTopButton) setShowBackToTopButton(scrollCheck);
            });
        };
    });

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const variants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                duration: 0.1,
            },
        },
    };

    return (
        <motion.button
            className={`group fixed bottom-[30px] right-[30px] z-[999] inline-flex items-center rounded-full border-2 border-primary bg-primary p-3 text-white transition-all duration-200 ease-in-out hover:border-primary hover:bg-white hover:text-primary`}
            onClick={handleClick}
            variants={variants}
            initial="initial"
            animate={showBackToTopButton ? "animate" : "initial"}
        >
            <ChevronUp
                size={24}
                className="stroke-white transition duration-200 ease-in-out group-hover:stroke-primary"
            />
            <span className="sr-only">Retourner en haut</span>
        </motion.button>
    );
};
