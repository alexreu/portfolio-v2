"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type AnimatedDetailsProps = {
    id: string;
    label: string;
    screenReaderSuffix: string;
    isOpen: boolean;
    onToggle: () => void;
    children: ReactNode;
    className?: string;
    buttonClassName?: string;
    contentClassName?: string;
};

export const AnimatedDetails = ({
    id,
    label,
    screenReaderSuffix,
    isOpen,
    onToggle,
    children,
    className = "",
    buttonClassName = "",
    contentClassName = "",
}: AnimatedDetailsProps) => {
    const reduceMotion = useReducedMotion();
    const contentId = `${id}-content`;

    return (
        <div className={className}>
            <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={onToggle}
                className={`focus-visible:outline-primary flex w-full cursor-pointer items-center justify-between gap-3 rounded focus-visible:outline-2 focus-visible:outline-offset-2 ${buttonClassName}`}
            >
                <span>
                    {label}
                    <span className="sr-only"> {screenReaderSuffix}</span>
                </span>
                <ChevronDown
                    aria-hidden="true"
                    className={`size-4 shrink-0 transition-transform ${reduceMotion ? "duration-0" : "duration-300"} ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={contentId}
                        role="region"
                        aria-label={`${label} ${screenReaderSuffix}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={
                            reduceMotion
                                ? { duration: 0 }
                                : {
                                      height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                                      opacity: { duration: 0.2, ease: "easeOut" },
                                  }
                        }
                        className="overflow-hidden"
                    >
                        <div className={contentClassName}>{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
