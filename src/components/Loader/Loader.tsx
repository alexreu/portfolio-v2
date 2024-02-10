"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Loader.module.css";

export const Loader = () => {
    return (
        <motion.div exit={{ opacity: 0 }} className={styles.loaderWrapper}>
            <h1 className="mb-6 font-main text-[50px] font-bold tracking-widest text-white">AlexDevLab</h1>
            <div className="flex h-[100px] w-[100px] items-center justify-center">
                <motion.div
                    className={styles.loader}
                    initial={{ opacity: 1, width: 0, height: 0 }}
                    animate={{ opacity: 0, width: 100, height: 100 }}
                    transition={{
                        default: { ease: "linear", repeat: Infinity, duration: 0.8 },
                    }}
                ></motion.div>
            </div>
            <span className="mt-6 font-main text-lg font-bold uppercase tracking-widest text-white">
                Chargement en cours...
            </span>
        </motion.div>
    );
};
