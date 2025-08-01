"use client";

import { useMouse } from "@uidotdev/usehooks";
import { motion } from "motion/react";
import { useMemo } from "react";

export const MousePointer = () => {
    const [mouse] = useMouse();

    const variants = useMemo(() => {
        return {
            default: {
                x: mouse.x - 19,
                y: mouse.y - 20,
            },
        };
    }, [mouse]);

    return (
        <motion.div
            className="fixed left-0 top-0 hidden h-8 w-8 rounded-full border-2 border-primary xl:flex"
            variants={variants}
            animate="default"
            transition={{
                x: {
                    duration: 0.3,
                    ease: "linear",
                    repeat: 0,
                    type: "spring",
                    stiffness: 80,
                },
                y: {
                    duration: 0.3,
                    ease: "linear",
                    repeat: 0,
                    type: "spring",
                    stiffness: 80,
                },
                default: {
                    duration: 2.5,
                    repeat: Infinity,
                },
            }}
        ></motion.div>
    );
};
