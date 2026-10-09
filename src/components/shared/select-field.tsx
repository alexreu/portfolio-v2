import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectFieldProps = ComponentProps<"select"> & {
    /** Around the select: full width by default, "w-auto" to fit its options. */
    wrapperClassName?: string;
    /** The chevron's colour, from the theme of the page. */
    chevronClassName?: string;
};

/**
 * A native select with its own chevron, set as far from the edge as the text is: the browser's
 * arrow cannot be moved, so it is hidden. Every select of the site goes through it.
 */
export const SelectField = ({
    className,
    wrapperClassName,
    chevronClassName,
    ...props
}: SelectFieldProps) => (
    <span className={cn("relative grid", wrapperClassName)}>
        <select {...props} className={cn("cursor-pointer appearance-none pr-11", className)} />
        <ChevronDown
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2",
                chevronClassName,
            )}
        />
    </span>
);
