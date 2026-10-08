import type { ComponentProps, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DraftIssue } from "@/lib/wedding-dashboard/drafts";
import type { CellTone } from "@/lib/wedding-dashboard/households";
import type { DashboardPage } from "@/lib/wedding-dashboard/pages";
import { planOf } from "@/lib/wedding-dashboard/plans";

import { dashboardEntry } from "./dashboard-pages";

const pill =
    "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color,scale] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 [&_svg]:size-4 [&_svg]:shrink-0";

export const buttonStyles = {
    primary: cn(pill, "bg-wed-ink text-wed-paper hover:bg-black"),
    secondary: cn(pill, "border-wed-line bg-wed-paper text-wed-ink hover:border-wed-ink border"),
    quiet: cn(pill, "text-wed-ink-soft hover:bg-wed-line-soft hover:text-wed-ink px-3.5"),
    danger: cn(pill, "bg-wed-no hover:bg-wed-no/90 text-white"),
} as const;

export const iconButton =
    "text-wed-muted hover:border-wed-line hover:bg-wed-paper hover:text-wed-ink inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-transparent transition-colors [&_svg]:size-4";

type CardProps = {
    id?: string;
    title: string;
    titleId: string;
    /** The section's key, to say which formula it comes with when not every one has it. */
    plan?: string;
    aside?: ReactNode;
    className?: string;
    children: ReactNode;
};

/** The formula a section comes with: the demo plays Signature, the prospect may not. */
export const PlanBadge = ({ section }: { section: string }) => {
    const plan = planOf(section);
    if (!plan) return null;
    return (
        <span className="border-wed-line text-wed-ink-soft rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap">
            {plan.note}
        </span>
    );
};

/** The title of a page of the dashboard, with what it is for. */
export const PageHeader = ({ page }: { page: DashboardPage }) => {
    const { label, intro } = dashboardEntry(page);
    return (
        <div>
            <h1 className="font-wed-serif text-[2.6rem] leading-tight font-medium">{label}</h1>
            <p className="text-wed-muted">{intro}</p>
        </div>
    );
};

export const Card = ({ id, title, titleId, plan, aside, className, children }: CardProps) => (
    <section
        id={id}
        aria-labelledby={titleId}
        className={cn("border-wed-line-soft bg-wed-paper rounded-2xl border", className)}
    >
        <div className="border-wed-line-soft flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-5 py-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <h2 id={titleId} className="text-[0.95rem] font-semibold">
                    {title}
                </h2>
                {plan && <PlanBadge section={plan} />}
            </div>
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

/**
 * A select with its own chevron, set away from the edge: the browser's arrow cannot be moved.
 * Full width by default; `wrapperClassName="w-auto"` sizes it to its options.
 */
export const Select = ({
    className,
    wrapperClassName,
    ...props
}: ComponentProps<"select"> & { wrapperClassName?: string }) => (
    <span className={cn("relative grid", wrapperClassName)}>
        <select
            {...props}
            className={cn(inputStyles, "cursor-pointer appearance-none pr-11", className)}
        />
        <ChevronDown
            aria-hidden="true"
            className="text-wed-muted pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
        />
    </span>
);

export const FieldError = ({ id, message }: { id: string; message: string | undefined }) =>
    message ? (
        <p id={id} className="text-wed-no mt-1.5 text-sm">
            {message}
        </p>
    ) : null;

/** Where a sentence needs a word for a count: 1 foyer, 2 foyers. */
export const plural = (count: number, one: string, many: string) =>
    `${count} ${count > 1 ? many : one}`;

/** What every form of the dashboard says about a field it cannot accept. */
export const issueMessages: Record<DraftIssue["code"], string> = {
    required: "À renseigner.",
    "too-long": "Un peu long : raccourcissez.",
    "guest-required": "Ajoutez au moins une personne.",
    "moment-required": "Cochez au moins un moment.",
    "email-invalid": "Cette adresse ne semble pas complète.",
    "email-taken": "Cette adresse a déjà un accès.",
    "access-required": "Ouvrez au moins une fonction.",
    "date-invalid": "Date invalide.",
    "date-past": "Choisissez une date à venir.",
    "slot-required": "Ajoutez au moins un horaire.",
    "time-invalid": "Heure attendue, par exemple 16:00.",
    "number-taken": "Ce numéro est déjà pris.",
    "out-of-range": "Valeur hors limites.",
    limit: "Six questions au plus.",
};
