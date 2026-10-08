import { flagsOf, planSpec, type Flag, type PlanId } from "@alexreu/wedding-core";

/** Signature shows every function, each with its formula's badge, until the visitor picks another. */
export const DEFAULT_DEMO_PLAN: PlanId = "signature";

/** The word for each formula in the demo's address: `?formule=intime`. */
export const PLAN_PARAMS: Readonly<Record<PlanId, string>> = {
    intimate: "intime",
    essential: "essentiel",
    signature: "signature",
};

/** The formula an address asks for; null for none or an unknown word. */
export const planFromParam = (value: string | readonly string[] | undefined): PlanId | null => {
    const word = (Array.isArray(value) ? value[0] : value)?.toString().trim().toLowerCase();
    return (
        (Object.keys(PLAN_PARAMS) as PlanId[]).find((plan) => PLAN_PARAMS[plan] === word) ?? null
    );
};

/** What the demo opens with the formula, without options: exactly what it sells. */
export const demoFlags = (plan: PlanId): ReadonlySet<Flag> => flagsOf({ plan, options: [] });

export const demoPlanName = (plan: PlanId) => planSpec(plan)?.name ?? plan;
