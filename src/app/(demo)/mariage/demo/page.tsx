import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";
import { DemoSite } from "@/components/wedding-demo/demo-site";

export const metadata: Metadata = buildPageMetadata({
    title: "Démo · Camille & Hugo",
    description:
        "Exemple de site de mariage : faire-part animé, programme personnalisé, réponses des invités par lien personnel et galerie photo du jour J.",
    path: "/mariage/demo",
});

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WeddingDemoPage({ searchParams }: Props) {
    const params = await searchParams;
    return (
        <DemoSite
            skipInvitation={"skip" in params}
            startOnWeddingDay={"jourj" in params}
            householdId={typeof params.foyer === "string" ? params.foyer : undefined}
        />
    );
}
