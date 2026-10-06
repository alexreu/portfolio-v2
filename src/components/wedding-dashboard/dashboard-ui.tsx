import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { CellTone } from "@/lib/wedding-dashboard/households";

const pill =
    "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color,scale] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 [&_svg]:size-4 [&_svg]:shrink-0";

export const buttonStyles = {
    primary: cn(pill, "bg-wed-ink text-wed-paper hover:bg-black"),
    secondary: cn(pill, "border-wed-line bg-wed-paper text-wed-ink hover:border-wed-ink border"),
    quiet: cn(pill, "text-wed-ink-soft hover:bg-wed-line-soft hover:text-wed-ink px-3.5"),
} as const;

export const iconButton =
    "text-wed-muted hover:border-wed-line hover:bg-wed-paper hover:text-wed-ink inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-transparent transition-colors [&_svg]:size-4";

type CardProps = {
    id?: string;
    title: string;
    titleId: string;
    aside?: ReactNode;
    className?: string;
    children: ReactNode;
};

export const Card = ({ id, title, titleId, aside, className, children }: CardProps) => (
    <section
        id={id}
        aria-labelledby={titleId}
        className={cn("border-wed-line-soft bg-wed-paper rounded-2xl border", className)}
    >
        <div className="border-wed-line-soft flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-5 py-4">
            <h2 id={titleId} className="text-[0.95rem] font-semibold">
                {title}
            </h2>
            {aside}
        </div>
        {children}
    </section>
);

const chipTones: Record<CellTone, string> = {
    yes: "bg-wed-yes-bg text-wed-yes",
    no: "bg-wed-no-bg text-wed-no",
    wait: "bg-wed-wait-bg text-wed-wait",
    closed: "bg-wed-line-soft text-wed-muted",
    none: "text-wed-muted border-wed-line border border-dashed",
};

export const Chip = ({ tone, children }: { tone: CellTone; children: ReactNode }) => (
    <span
        className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
            chipTones[tone],
        )}
    >
        {tone !== "none" && (
            <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
        )}
        {children}
    </span>
);

export const inputStyles =
    "border-wed-line bg-wed-paper text-wed-ink placeholder:text-wed-muted/70 aria-invalid:border-wed-no min-h-11 w-full rounded-xl border px-3.5 text-[0.95rem]";

export const FieldError = ({ id, message }: { id: string; message: string | undefined }) =>
    message ? (
        <p id={id} className="text-wed-no mt-1.5 text-sm">
            {message}
        </p>
    ) : null;

/** Where a sentence needs a word for a count: 1 foyer, 2 foyers. */
export const plural = (count: number, one: string, many: string) =>
    `${count} ${count > 1 ? many : one}`;
