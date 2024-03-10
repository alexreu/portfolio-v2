"use client";

import { useEffect, useState } from "react";
import { ServicesPageData } from "@/lib/types";
import { getServicesPageData } from "@/lib/sanity/sanity.query";
import { ServiceCard } from "@/components/services-page/service-card";
import { motion } from "framer-motion";

export default function Services() {
    const [servicePageData, setServicePageData] = useState<ServicesPageData[] | []>(new Array(4).fill(Math.random()));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: ServicesPageData[] = await getServicesPageData();
                setServicePageData(data);
            } catch (error) {
                console.error("Error fetching pricing page data:", error);
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
            className="grid grid-cols-1 gap-5 xl:grid-cols-12"
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
