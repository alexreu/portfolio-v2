import { cn } from "@/lib/utils";
import { headingParts } from "@/lib/wedding-service/heading";
import type { Heading } from "@/lib/wedding-service/types";

type DemoHeadingProps = {
    id: string;
    number: string;
    label: string;
    heading: Heading;
    tone?: "light" | "dark";
};

/** "N° 02 — Programme" over a large Newsreader title with italic emphasis. */
export const DemoHeading = ({ id, number, label, heading, tone = "light" }: DemoHeadingProps) => (
    <div>
        <p
            className={cn(
                "font-demo-serif text-[0.95rem] italic",
                tone === "dark" ? "text-demo-earth" : "text-demo-earth-dark",
            )}
        >
            N° {number} — {label}
        </p>
        <h2
            id={id}
            className="font-demo-serif mt-3 text-5xl leading-none font-normal tracking-tight md:text-7xl"
        >
            {headingParts(heading).map((part, index) =>
                part.emphasized ? (
                    <em key={index} className="italic">
                        {part.text}
                    </em>
                ) : (
                    <span key={index}>{part.text}</span>
                ),
            )}
        </h2>
    </div>
);
