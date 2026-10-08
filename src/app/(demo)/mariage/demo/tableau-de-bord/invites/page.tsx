import type { Metadata } from "next";

import { GuestsPage } from "@/components/wedding-dashboard/pages/guests-page";

import { dashboardPageMetadata } from "../page-metadata";

export const metadata: Metadata = dashboardPageMetadata("guests");

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** `?foyer=`: opens that household's detail, as the guest site's « Corriger ce foyer » asks. */
export default async function DashboardGuestsPage({ searchParams }: Props) {
    const { foyer } = await searchParams;
    return <GuestsPage openId={typeof foyer === "string" ? foyer : undefined} />;
}
