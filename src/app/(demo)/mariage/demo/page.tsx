import type { Metadata } from "next";
import { isPreview } from "@alexreu/wedding-core";

import { buildPageMetadata, weddingDemoImage } from "@/lib/seo";
import { SHARED_MARK } from "@/lib/wedding-demo/routes";
import { DemoSite } from "@/components/wedding-demo/demo-site";

export const metadata: Metadata = buildPageMetadata({
    title: "Exemple de site de mariage · Camille & Hugo",
    description:
        "Exemple de site de mariage : faire-part animé, programme personnalisé, réponses des invités par lien personnel et galerie photo du jour J.",
    path: "/mariage/demo",
    image: weddingDemoImage,
});

/** `?foyer=` as given; an empty or repeated one names no household, so it opens none. */
const householdIdOf = (foyer: string | string[] | undefined) => {
    if (foyer === undefined) return undefined;
    return typeof foyer === "string" ? foyer : "";
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WeddingDemoPage({ searchParams }: Props) {
    const params = await searchParams;
    return (
        <DemoSite
            skipInvitation={"skip" in params}
            startOnWeddingDay={"jourj" in params}
            startAfter={"apres" in params}
            householdId={householdIdOf(params.foyer)}
            preview={isPreview(params)}
            shared={SHARED_MARK in params}
        />
    );
}
