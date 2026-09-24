"use client";

import { useSyncExternalStore } from "react";

type CurrentYearProps = {
    // Year computed on the server when the page was rendered.
    renderedYear: number;
};

const subscribe = () => () => {};
const getYear = () => new Date().getFullYear();

/**
 * The page is prerendered, so its HTML carries the build year. Hydrating with the
 * server value avoids a mismatch, then React swaps in the visitor's current year.
 */
export const CurrentYear = ({ renderedYear }: CurrentYearProps) => {
    const year = useSyncExternalStore(subscribe, getYear, () => renderedYear);

    return <time dateTime={String(year)}>{year}</time>;
};
