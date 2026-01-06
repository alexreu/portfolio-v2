"use client";

import { ServiceCard } from "@/components/services-page/service-card";
import { getServicesPageData } from "@/lib/sanity/sanity.query";
import { ServicesPageData } from "@/lib/types";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function Services() {
    const [servicePageData, setServicePageData] = useState<ServicesPageData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: ServicesPageData[] = await getServicesPageData();
                setServicePageData(data);
            } catch (error) {
                console.error("Error fetching services page data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "tween" }}
            className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-12"
        >
            {servicePageData.map(({ serviceTitle, serviceDescription, serviceIllustration, _id }, i: number) => (
                <ServiceCard
                    key={_id ?? i}
                    title={serviceTitle}
                    description={serviceDescription}
                    illustration={serviceIllustration?.image}
                    isLoading={loading}
                />
            ))}
        </motion.section>
    );
}
