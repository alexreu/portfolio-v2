import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export const AboutTabItem = ({ item }) => {
    const [{ content }] = item || {};
    return (
        <motion.ul layoutId="about" className="pt-5 space-y-4 overflow-hidden font-main">
            {content &&
                content.map((item, index) => {
                    const { title, description } = item;
                    return (
                        <AnimatePresence key={index}>
                            <motion.li className="text-body dark:text-white text-base font-light">
                                <span className="block font-medium text-heading dark:text-dark-body">{title}</span>
                                {description}
                            </motion.li>
                        </AnimatePresence>
                    );
                })}
        </motion.ul>
    );
};
