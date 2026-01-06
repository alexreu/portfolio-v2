"use client";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

export const GlobalLoading = () => {
    return (
        <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: "tween" }}
            className="pointer-events-none absolute left-0 top-0 z-9999 flex h-screen w-screen items-center
                justify-center bg-black"
        >
            <div className="container flex w-full flex-col items-center justify-center gap-3">
                <div className="relative flex h-48 w-48 items-center justify-center">
                    <Image src="/images/logo-white-8.png" alt="Chargement" width={160} height={160} priority />
                    <Loader2
                        className="absolute left-0 top-0 h-full w-full animate-spin stroke-primary"
                        strokeWidth={1}
                    />
                </div>
            </div>
        </motion.div>
    );
};
