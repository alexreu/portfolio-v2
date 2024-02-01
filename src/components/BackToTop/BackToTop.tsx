"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
            className={`fixed inline-flex items-center z-[999] bottom-[30px] right-[30px] p-3 bg-primary text-white rounded-full border-2 border-primary transition-all duration-200 ease-in-out hover:bg-white hover:border-primary hover:text-primary`}
            onClick={handleClick}
            variants={variants}
            initial="initial"
            animate={showBackToTopButton ? "animate" : "initial"}
        >
            <i className="bi bi-chevron-up inline-flex items-center"></i>
            <span className="sr-only">Retourner en haut</span>
        </motion.button>
    );
};
