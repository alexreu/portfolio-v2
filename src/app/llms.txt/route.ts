import { weddingLlmsSection } from "@/lib/llms";
import { getProjectUrl } from "@/lib/projects";
import { getHomepageData, getWeddingService } from "@/lib/sanity/sanity.query";
import type { PricingPlan } from "@/lib/sanity/types";
import { absoluteUrl, site, weddingPage } from "@/lib/seo";
import { resolveWeddingService } from "@/lib/wedding-service/content";

// Plain-text brief for LLM crawlers (https://llmstxt.org), rebuilt from Sanity so
// AI answers quote the same services and prices as the page itself.
export const revalidate = 86400;

const formatPrice = (plan: PricingPlan) => {
    if (plan.priceType === "custom" || plan.price == null) return plan.priceCustom || "sur devis";
    const amount = `${plan.price.toLocaleString("fr-FR")} € HT`;
    return plan.startingFrom ? `à partir de ${amount}` : amount;
};

export async function GET() {
    const [data, wedding] = await Promise.all([getHomepageData(), getWeddingService()]);
    const contact = data.settings?.contact;
    const services =
        data.services.length > 0
            ? data.services.map((service) => `- ${service.title} : ${service.description}`)
            : site.services.map((service) => `- ${service}`);
    const projects = data.projects.flatMap((project) => {
        const url = getProjectUrl(project.url);
        return url
            ? [`- [${project.title}](${url}) (${project.category}) : ${project.description}`]
            : [];
    });
    const socials =
        data.settings?.socialLinks?.map((link) => `- [${link.platform}](${link.url})`) ?? [];

    const sections = [
        `# ${site.name}`,
        `> ${site.description}`,
        [
            `${site.name} est l'activité freelance d'${site.author.name}, ${site.author.jobTitle.toLowerCase()} basé à ${site.address.addressLocality} (${site.address.addressRegion}, 974).`,
            "Il conçoit et développe des sites vitrines, des applications web React / Next.js et des interfaces sur mesure pour des indépendants, TPE, PME et startups, à La Réunion comme en métropole, en télétravail.",
        ].join(" "),
        ["## Services", ...services].join("\n"),
        data.pricingPlans.length > 0 &&
            [
                "## Tarifs",
                ...data.pricingPlans.map(
                    (plan) =>
                        `- ${plan.name} : ${formatPrice(plan)}${plan.description ? `. ${plan.description}` : ""}`,
                ),
                ...(data.maintenance?.plans ?? []).map(
                    (plan) =>
                        `- Maintenance ${plan.name} : ${plan.price.toLocaleString("fr-FR")} € HT. ${plan.summary}`,
                ),
            ].join("\n"),
        weddingLlmsSection(resolveWeddingService(wedding)),
        ["## Expertise", site.expertise.join(", ")].join("\n"),
        projects.length > 0 && ["## Projets", ...projects].join("\n"),
        [
            "## Contact",
            `- Email : ${contact?.email ?? site.email}`,
            ...(contact?.phone ? [`- Téléphone : ${contact.phone}`] : []),
            `- Zone d'intervention : La Réunion et France entière (à distance)`,
            `- Devis gratuit, réponse sous 24 h`,
            ...socials,
        ].join("\n"),
        [
            "## Pages",
            `- [Accueil](${absoluteUrl("/")}) : présentation, services, projets, tarifs et contact`,
            `- [Sites de mariage](${absoluteUrl(weddingPage.path)}) : offre, démo, tarifs et FAQ`,
            `- [Mentions légales](${absoluteUrl("/mentions-legales")}) : éditeur (SIRET 918 609 421 00014), hébergement`,
            `- [Politique de confidentialité](${absoluteUrl("/politique-de-confidentialite")})`,
        ].join("\n"),
    ];

    return new Response(`${sections.filter(Boolean).join("\n\n")}\n`, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
