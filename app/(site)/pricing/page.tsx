"use client";

import { PricingCard } from "@/components/pricing-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPricingPageData } from "@/lib/sanity/sanity.query";
import { PricingPageData } from "@/lib/types";
import { Blend, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Pricing() {
    const [pricingPageData, setPricingPageData] = useState<PricingPageData[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: PricingPageData[] = await getPricingPageData();
                setPricingPageData(data);
            } catch (error) {
                console.error("Error fetching pricing page data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            {pricingPageData?.map(({ _id, offerTitle, offerContent, isOfferCustom, monthlyPrice, fixedPrice }) => (
                <PricingCard
                    key={_id}
                    title={offerTitle}
                    fixedPrice={fixedPrice}
                    monthPrice={monthlyPrice}
                    content={offerContent}
                    isCustom={isOfferCustom}
                />
            ))}
            <Card
                className="item-center relative mt-5 flex flex-col items-center justify-center gap-6 opacity-100
                    backdrop-blur-xl xl:col-span-12"
            >
                <CardHeader>
                    <h1 className="text-center text-3xl font-semibold capitalize text-white">
                        Pour toutes autres questions / demandes
                    </h1>
                </CardHeader>
                <CardContent>
                    <Link
                        className="relative flex w-full items-center gap-3 rounded-xl border border-primary bg-primary
                            p-3 text-base font-medium tracking-wide text-white transition-all duration-300 ease-in-out
                            hover:border-primary hover:bg-white hover:text-primary"
                        href="#"
                    >
                        <span>Me contacter</span>
                        <span>
                            <Send size={22} />
                        </span>
                    </Link>
                </CardContent>
                <Blend
                    className="absolute right-1 top-1 rotate-90 stroke-muted-foreground opacity-50"
                    size={58}
                    strokeWidth={0.5}
                />
            </Card>
            {/* <Card
                className="relative col-span-1 mt-5 flex flex-col items-center justify-center gap-6 opacity-100
                    backdrop-blur-xl xl:col-span-6 xl:row-span-2 xl:row-start-3"
            >
                <CardHeader>
                    <h1 className="text-center text-3xl font-semibold capitalize text-white">
                        N&apos;hésitez pas a consulter mon profil de freelance sur la plateforme{" "}
                        <span className="text-primary">Malt</span>
                    </h1>
                </CardHeader>
                <CardContent>
                    <Link
                        className="relative flex w-full items-center gap-3 rounded-xl border border-primary bg-primary
                            p-3 text-base font-medium tracking-wide text-white transition-all duration-300 ease-in-out
                            hover:border-primary hover:bg-white hover:text-primary"
                        href="#"
                    >
                        <span>Voir mon profil</span>
                        <span>
                            <Send size={22} />
                        </span>
                    </Link>
                </CardContent>
                <Blend
                    className="absolute right-1 top-1 rotate-90 stroke-muted-foreground opacity-50"
                    size={58}
                    strokeWidth={0.5}
                />
            </Card> */}
        </div>
    );
}
