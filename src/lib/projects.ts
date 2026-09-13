import type { Project } from "@/lib/sanity/types";

// Initial selection until projects are published in Sanity. A CMS selection replaces
// this list in full, so editors can deliberately feature just one project.
export const defaultProjects: Project[] = [
    {
        _id: "nexa",
        title: "Nexa",
        category: "Landing page · Démonstration SaaS",
        description:
            "Rendre l’automatisation accessible. Une vitrine pour un outil d’IA, pensée autour d’un parcours clair et d’une interface épurée.",
        url: "https://nexa-nu-two.vercel.app/",
        cover: {
            image: "/images/projects/nexa.webp",
            alt: "Page d’accueil Nexa, interface claire aux accents violets",
        },
        tags: ["Interface produit", "Responsive"],
        order: 0,
    },
    {
        _id: "anne-esthetik",
        title: "Anne Esthetik",
        category: "Site vitrine · Beauté & bien-être",
        description:
            "Transposer la douceur d’un institut de beauté à La Réunion. Un univers délicat pour découvrir les soins, consulter les tarifs et prendre contact.",
        url: "https://anne-esthetik.re",
        cover: {
            image: "/images/projects/anne-esthetik.webp",
            alt: "Page d’accueil Anne Esthétik, tons pastel et illustration florale",
        },
        tags: ["Identité visuelle", "Responsive"],
        order: 1,
    },
];

export function getProjectUrl(value: string): string | null {
    try {
        const url = new URL(value);
        return ["https:", "http:"].includes(url.protocol) ? url.href : null;
    } catch {
        return null;
    }
}
