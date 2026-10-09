import type { Heading } from "./types";

export type HeadingPart = {
    readonly text: string;
    readonly emphasized: boolean;
};

export const headingParts = ({ text, emphasis }: Heading): readonly HeadingPart[] => {
    const start = emphasis ? text.indexOf(emphasis) : -1;
    if (!emphasis || start < 0) return [{ text, emphasized: false }];

    const end = start + emphasis.length;
    const parts: readonly HeadingPart[] = [
        { text: text.slice(0, start), emphasized: false },
        { text: emphasis, emphasized: true },
        { text: text.slice(end), emphasized: false },
    ];
    return parts.filter((part) => part.text !== "");
};
