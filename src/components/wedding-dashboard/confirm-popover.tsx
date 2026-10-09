"use client";

import { useState, type ReactElement } from "react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { buttonStyles } from "./dashboard-ui";

type ConfirmPopoverProps = {
    /** The button that asks for the action. */
    children: ReactElement;
    question: string;
    detail?: string;
    confirmLabel: string;
    onConfirm: () => void;
    align?: "start" | "center" | "end";
};

/** A small bubble beside the button, instead of the browser's blocking alert. */
export const ConfirmPopover = ({
    children,
    question,
    detail,
    confirmLabel,
    onConfirm,
    align = "start",
}: ConfirmPopoverProps) => {
    const [open, setOpen] = useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                align={align}
                sideOffset={8}
                aria-label={question}
                className="border-wed-line bg-wed-paper text-wed-ink font-main w-72 rounded-2xl p-4 shadow-lg motion-reduce:animate-none"
            >
                <p className="text-sm font-medium">{question}</p>
                {detail && <p className="text-wed-muted mt-1 text-xs">{detail}</p>}
                <div className="mt-3 flex justify-end gap-1.5">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className={cn(buttonStyles.quiet, "min-h-9 px-3")}
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onConfirm();
                        }}
                        className={cn(buttonStyles.danger, "min-h-9 px-4")}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
