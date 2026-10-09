"use client";

import type { ReactNode } from "react";

import { choosePlan } from "./plan-choice";

type PlanLinkProps = {
    plan: string;
    className?: string;
    children: ReactNode;
};

/** A plain anchor to the form: native scrolling, no navigation, the plan travels by event. */
export const PlanLink = ({ plan, className, children }: PlanLinkProps) => (
    <a href="#contact" onClick={() => choosePlan(plan)} className={className}>
        {children}
    </a>
);
