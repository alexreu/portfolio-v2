"use client";

import { PricingCard } from "@/components/pricing-card";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Blend, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PricingPageData } from "@/lib/types";
import { getPricingPageData } from "@/lib/sanity/sanity.query";

export default function Pricing() {
    const [pricingPageData, setPricingPageData] = useState<PricingPageData[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: PricingPageData[] = await getPricingPageData();
                setPricingPageData(data[0]);
            } catch (error) {
                console.error("Error fetching pricing page data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const { offerTitle, offerContent, isOfferCustom, fixedPrice, monthlyPrice } = pricingPageData ?? {};

    const MotionLink = motion(Link);
    const iconVariants = {
        initial: { opacity: 0, translateX: -5 },
        hover: { opacity: 1, translateX: 0 },
    };
    const linkVariants = {
        initial: { width: "150px" },
        hover: { width: "181px" },
    };

    return (
        <div className="grid grid-cols-12 grid-rows-3 gap-5">
            <PricingCard title="Offre basique" fixedPrice="499" monthPrice="45" content={[]} />
            <PricingCard title="Offre premium" fixedPrice="1299" monthPrice="64" content={[]} />
            <PricingCard title="Offre sur mesure" isCustom content={[]} />
            <Card
                className="relative col-span-12 row-span-2 row-start-3 mt-5 flex flex-col items-center gap-6 opacity-100
                    backdrop-blur-xl"
            >
                <CardHeader>
                    <h1 className="text-3xl font-semibold capitalize text-white">
                        Pour toutes autres questions / demandes
                    </h1>
                </CardHeader>
                <CardContent>
                    <MotionLink
                        className="relative flex w-full items-center gap-3 rounded-xl bg-primary p-3 text-lg font-medium
                            tracking-wide text-white"
                        href="#"
                        variants={linkVariants}
                        whileHover="hover"
                        initial="initial"
                        layout
                    >
                        <span>Me contacter</span>
                        <motion.span
                            className="absolute right-3"
                            variants={iconVariants}
                            transition={{ duration: 0.4, type: "spring" }}
                        >
                            <Send size={22} />
                        </motion.span>
                    </MotionLink>
                </CardContent>
                <Blend
                    className="absolute right-1 top-1 rotate-90 stroke-muted-foreground opacity-50"
                    size={58}
                    strokeWidth={0.5}
                />
            </Card>
        </div>
    );
}
