"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

type Props = {
    progress?: number;
};

export const GlobalLoading = ({ progress }: Props) => {
    return (
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
            <motion.div
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, translateY: -250 }}
                className="pointer-events-none absolute left-0 top-0 z-40 flex h-screen w-screen items-center
                    justify-center bg-black"
            >
                <div className="container flex w-full flex-col items-center justify-center gap-3">
                    <h1 className="text-xl tracking-wider text-white">
                        Chargement <span className="animate-pulse">...</span>
                    </h1>
                    <Progress className="max-w-96 bg-white" value={progress} max={100} />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
