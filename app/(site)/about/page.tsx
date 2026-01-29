import { Metadata } from "next";
import { getAboutPageData } from "@/lib/sanity/sanity.query";
import { AboutPageContent } from "@/components/about-page/about-page-content";

export const metadata: Metadata = {
    title: "A propos | AlexDevLab",
    description: "En savoir plus sur Alexandre ADOLPHE, développeur front freelance à l'île de la Réunion.",
};

export default async function About() {
    const data = await getAboutPageData();
    return <AboutPageContent data={data} />;
}
