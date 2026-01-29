"use client";

import { ServiceCard } from "@/components/services-page/service-card";
import { ServicesPageData } from "@/lib/types";
import { motion } from "motion/react";

type Props = {
    services: ServicesPageData[];
};

export const ServicesPageContent = ({ services }: Props) => {
    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "tween" }}
            className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-12"
        >
            {services.map(({ serviceTitle, serviceDescription, serviceIllustration, _id }, i) => (
                <ServiceCard
                    key={_id ?? i}
                    title={serviceTitle}
                    description={serviceDescription}
                    illustration={serviceIllustration?.image}
                />
            ))}
        </motion.section>
    );
};
