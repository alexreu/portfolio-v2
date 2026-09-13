"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { useLenis } from "@/components/layout/smooth-scroll";

export function BackToTop() {
    const [visible, setVisible] = useState(false);
    const reducedMotion = useReducedMotion();
    const lenis = useLenis();

    useEffect(() => {
        const update = () => setVisible(window.scrollY > 400);
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, []);

    if (!visible) return null;

    const backToTop = () => {
        const focusTop = () => document.getElementById("site-top")?.focus({ preventScroll: true });
        if (lenis) {
            lenis.scrollTo(0, { immediate: !!reducedMotion, onComplete: focusTop });
        } else {
            window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
            focusTop();
        }
    };

    return (
        <motion.button
            type="button"
            aria-label="Retour en haut de page"
            title="Retour en haut"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            onClick={backToTop}
            className="border-primary/40 bg-background/90 text-primary shadow-glow-sm hover:bg-primary focus-visible:ring-primary focus-visible:ring-offset-background fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 flex size-12 items-center justify-center rounded-full border backdrop-blur-md transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-offset-4 motion-reduce:transition-none md:right-8"
        >
            <ArrowUp aria-hidden="true" className="size-5" />
        </motion.button>
    );
}
