import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../Button";

export const AboutTabItem = ({ item }) => {
    const [{ content }] = item || {};
    const [displayShowMoreButton, setDisplayShowMoreButton] = useState(false);
    const [tabFold, setTabFold] = useState(true);

    const handleMoreButtonClick = () => {};
    return (
        <ul className="pt-5 space-y-4 overflow-hidden font-main">
            {content &&
                content.map((item, index) => {
                    const { title, description } = item;
                    return (
                        <AnimatePresence key={index}>
                            <motion.li layout className="text-body dark:text-white text-base font-light">
                                <span className="block font-medium text-heading dark:text-dark-body">{title}</span>
                                {description}
                            </motion.li>
                        </AnimatePresence>
                    );
                })}
            {displayShowMoreButton && (
                <div className="inline-flex justify-center items-center lgd:hidden relative w-full mt-4 before:absolute before:h-px before:left-0 beforew-full before:z-[1] before:bottom-1/2 before:bg-border before:transform before:translate-y-1/2">
                    <Button
                        type="button"
                        style={`btn z-[2] mx-auto rounded-full p-2 bg-primary text-white border-primary transition-200 
                        hover:bg-white dark:hover:bg-background-dark-light hover:text-primary dark:hover:text-primary focus:bg-white dark:focus:bg-background-dark-light focus:text-primary`}
                        onClick={handleMoreButtonClick}
                    >
                        <i
                            className={`bi bi-chevron-down inline-flex transform ${
                                !tabFold && "-rotate-180"
                            } transition-200`}
                        ></i>
                        <span className="sr-only">Déplier</span>
                    </Button>
                </div>
            )}
        </ul>
    );
};
