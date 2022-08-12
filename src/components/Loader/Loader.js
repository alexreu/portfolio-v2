import React from "react";
import { motion } from "framer-motion";
import styles from "./Loader.module.css";

export const Loader = () => {
    return (
        <div className={styles.loaderWrapper}>
            <h1 className="mb-6 text-[50px] text-white font-main font-bold tracking-widest">Alex Developpement</h1>
            <div className="flex items-center justify-center h-[100px] w-[100px]">
                <motion.div
                    className={styles.loader}
                    initial={{ opacity: 1, width: 0, height: 0 }}
                    animate={{ opacity: 0, width: 100, height: 100 }}
                    transition={{
                        default: { ease: "linear", repeat: Infinity, duration: 0.8 },
                    }}
                ></motion.div>
            </div>
            <span className="mt-6 text-white font-bold uppercase text-lg tracking-widest font-main">
                Chargement en cours...
            </span>
        </div>
    );
};
