"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const PLAN_EVENT = "mariage:formule";

/** "Choisir Intime" talks to the contact form without touching the URL, so nothing re-renders. */
export const choosePlan = (plan: string) =>
    window.dispatchEvent(new CustomEvent<string>(PLAN_EVENT, { detail: plan }));

const noSubscription = () => () => {};

/** `?formule=` from a shared link: unknown on the server, read once in the browser. */
const usePlanFromLink = () =>
    useSyncExternalStore(
        noSubscription,
        () => new URLSearchParams(window.location.search).get("formule"),
        () => null,
    );

/** The plan picked in the pricing cards, else the one in a shared link, else the default. */
export const usePlanChoice = (fallback: string) => {
    const fromLink = usePlanFromLink();
    const [chosen, setChosen] = useState<string | null>(null);

    useEffect(() => {
        const onChoice = (event: Event) => setChosen((event as CustomEvent<string>).detail);
        window.addEventListener(PLAN_EVENT, onChoice);
        return () => window.removeEventListener(PLAN_EVENT, onChoice);
    }, []);

    return [chosen ?? fromLink ?? fallback, setChosen] as const;
};
