import React, { useState } from "react";
import { animated, easings, Spring, useSpring } from "react-spring";
import styles from "./Loader.module.css";

export const Loader = () => {
    const animation = useSpring({
        from: { opacity: 1, width: 0, height: 0 },
        to: { opacity: 0, width: 100, height: 100 },
        config: { duration: 1200, easing: easings.easeInOutQuad },
        reset: true,
        loop: true,
    });

    return (
        <div className={styles.loaderWrapper}>
            <div className="flex items-center justify-center h-[100px] w-[100px]">
                <animated.div style={animation} className={styles.loader}></animated.div>
            </div>
            <span className="mt-6 text-white font-bold uppercase text-lg tracking-widest">Chargement en cours...</span>
        </div>
    );
};
