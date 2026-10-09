import { cn } from "@/lib/utils";
import { headingParts } from "@/lib/wedding-service/heading";
import type { Heading } from "@/lib/wedding-service/types";

type EmphasisHeadingProps = {
    heading: Heading;
    as?: "h1" | "h2";
    id?: string;
    className?: string;
    emphasisClassName?: string;
    /** A short label inside the heading, above it: the words searched for, set small. */
    kicker?: string;
};

export const EmphasisHeading = ({
    heading,
    as: Tag = "h2",
    id,
    className,
    emphasisClassName = "text-wed-gold",
    kicker,
}: EmphasisHeadingProps) => (
    <Tag id={id} className={cn("font-wed-serif font-normal tracking-tight", className)}>
        {kicker && (
            <span className="font-main text-wed-gold mb-5 block text-xs font-medium tracking-[0.18em] uppercase">
                {kicker}
            </span>
        )}
        {headingParts(heading).map((part, index) =>
            part.emphasized ? (
                <em key={index} className={cn("italic", emphasisClassName)}>
                    {part.text}
                </em>
            ) : (
                <span key={index}>{part.text}</span>
            ),
        )}
    </Tag>
);
