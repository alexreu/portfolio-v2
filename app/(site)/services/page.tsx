import { Metadata } from "next";

import { getServicesPageData } from "@/lib/sanity/sanity.query";
import { ServicesPageContent } from "@/components/services-page/services-page-content";

export const metadata: Metadata = {
    title: "Services | AlexDevLab",
    description: "Découvrez les services de développement web proposés par AlexDevLab.",
};

export default async function Services() {
    const services = await getServicesPageData();
    return <ServicesPageContent services={services} />;
}
