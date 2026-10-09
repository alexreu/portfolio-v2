"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { PlanId } from "@alexreu/wedding-core";

import { DEFAULT_DEMO_PLAN, PLAN_PARAMS, planFromParam } from "@/lib/wedding-demo/offer";

const KEY = "alexdevlab:mariage-demo:formule";

const listeners = new Set<() => void>();
/** The choice made on this page, which holds even when the browser refuses to store it. */
const memory: { plan: PlanId | null } = { plan: null };

/** The formula the demo plays: the visitor's choice, Signature otherwise. Readable outside React. */
export const readDemoPlan = (): PlanId => {
    if (memory.plan) return memory.plan;
    try {
        return planFromParam(window.localStorage.getItem(KEY) ?? undefined) ?? DEFAULT_DEMO_PLAN;
    } catch {
        return DEFAULT_DEMO_PLAN;
    }
};

const store = (plan: PlanId) => {
    memory.plan = plan;
    try {
        window.localStorage.setItem(KEY, PLAN_PARAMS[plan]);
    } catch {
        /* Storage refused: the choice stays in memory. */
    }
    listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", listener);
    };
};

/**
 * The formula the demo plays, shared by the dashboard and the guest site: chosen in the demo's
 * notice, or given by the address (`?formule=intime`) to land on one formula directly.
 */
export const useDemoPlan = () => {
    const plan = useSyncExternalStore(subscribe, readDemoPlan, () => DEFAULT_DEMO_PLAN);
    useEffect(() => {
        const asked = planFromParam(
            new URLSearchParams(window.location.search).get("formule") ?? undefined,
        );
        if (asked && asked !== readDemoPlan()) store(asked);
    }, []);
    const set = useCallback((next: PlanId) => store(next), []);
    return [plan, set] as const;
};
