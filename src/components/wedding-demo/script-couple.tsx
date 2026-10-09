import { cn } from "@/lib/utils";

type ScriptCoupleProps = {
    first: string;
    second: string;
    className?: string;
};

/**
 * The couple's names in the script, the ampersand in the serif italic: the script's own « & »
 * is an old « Et » that reads as a broken letter. As on the faire-part and the site's hero.
 */
export const ScriptCouple = ({ first, second, className }: ScriptCoupleProps) => (
    <p className={cn("font-demo-script leading-[1.3]", className)}>
        {first}{" "}
        <span className="font-demo-serif text-demo-earth-dark text-[0.55em] italic">&amp;</span>{" "}
        {second}
    </p>
);
