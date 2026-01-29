import { ServicesPageData } from "@/lib/types";
import { ServiceCard } from "@/components/services-page/service-card";

type Props = {
    services: ServicesPageData[];
};

export const ServicesPageContent = ({ services }: Props) => {
    return (
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-12">
            {services.map(({ serviceTitle, serviceDescription, serviceIllustration, _id }, i) => (
                <ServiceCard
                    key={_id ?? i}
                    title={serviceTitle}
                    description={serviceDescription}
                    illustration={serviceIllustration?.image}
                />
            ))}
        </section>
    );
};
