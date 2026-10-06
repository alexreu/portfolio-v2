import { absoluteUrl, weddingDashboardDemoPage, weddingPage } from "@/lib/seo";
import type { WeddingPlan, WeddingService } from "@/lib/wedding-service/types";

const formatEuros = (amount: number) => `${amount.toLocaleString("fr-FR")} €`;

const planLine = (plan: WeddingPlan) =>
    `- ${plan.name} : ${formatEuros(plan.price)}. ${plan.tagline}`;

/** Wedding offer, sold to individuals under VAT franchise: net prices, never "HT". */
export const weddingLlmsSection = (content: WeddingService) =>
    [
        "## Sites de mariage",
        `${weddingPage.description} Page : ${absoluteUrl(weddingPage.path)} · démo : ${absoluteUrl(`${weddingPage.path}/demo`)} · tableau de bord des mariés : ${absoluteUrl(weddingDashboardDemoPage.path)}`,
        ...content.pricing.plans.map(planLine),
        content.pricing.note,
    ].join("\n");
