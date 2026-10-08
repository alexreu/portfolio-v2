"use client";

import { useState, type ReactNode } from "react";
import { FileDown, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

import { buttonStyles } from "./dashboard-ui";

type PdfButtonProps = {
    /** Builds the PDF and downloads it. */
    onExport: () => Promise<void>;
    children: ReactNode;
    ariaLabel?: string;
    variant?: keyof typeof buttonStyles;
    className?: string;
    /** Read aloud while it builds, and shown if it fails: a PDF unless said otherwise. */
    busyText?: string;
    failedText?: string;
};

/** A PDF to download: a moment to build, and a word if it fails. */
export const PdfButton = ({
    onExport,
    children,
    ariaLabel,
    variant = "secondary",
    className,
    busyText = "Préparation du PDF…",
    failedText = "Le PDF n'a pas pu être préparé. Réessayez dans un instant.",
}: PdfButtonProps) => {
    const [state, setState] = useState<"idle" | "busy" | "failed">("idle");
    const run = async () => {
        setState("busy");
        try {
            await onExport();
            setState("idle");
        } catch {
            setState("failed");
        }
    };
    return (
        <>
            {/* Same label while it works: the icon turns into a spinner, the width never moves. */}
            <button
                type="button"
                onClick={run}
                disabled={state === "busy"}
                aria-busy={state === "busy"}
                aria-label={ariaLabel}
                className={cn(
                    buttonStyles[variant],
                    "disabled:cursor-wait disabled:opacity-70",
                    className,
                )}
            >
                {state === "busy" ? (
                    <LoaderCircle aria-hidden="true" className="motion-safe:animate-spin" />
                ) : (
                    <FileDown aria-hidden="true" />
                )}
                {children}
            </button>
            <span role="status" className="sr-only">
                {state === "busy" ? busyText : ""}
            </span>
            {state === "failed" && (
                <p role="alert" className="text-wed-no basis-full text-xs">
                    {failedText}
                </p>
            )}
        </>
    );
};
