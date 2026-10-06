import { cn } from "@/lib/utils";
import { headingParts } from "@/lib/wedding-service/heading";
import type { Heading } from "@/lib/wedding-service/types";

type EmphasisHeadingProps = {
    heading: Heading;
    as?: "h1" | "h2";
    id?: string;
    className?: string;
    emphasisClassName?: string;
};

export const EmphasisHeading = ({
    heading,
    as: Tag = "h2",
    id,
    className,
    emphasisClassName = "text-wed-gold",
}: EmphasisHeadingProps) => (
    <Tag id={id} className={cn("font-wed-serif font-normal tracking-tight", className)}>
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
