"use client";

import { PricingCard } from "@/components/pricing-page/pricing-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPricingPageData } from "@/lib/sanity/sanity.query";
import { PricingPageData } from "@/lib/types";
import { Blend, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CardSkeleton } from "@/components/card-skeleton";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Pricing() {
    const [pricingPageData, setPricingPageData] = useState<PricingPageData[] | null>(null);
    const [loading, setLoading] = useState(true);

    const MotionCard = motion(Card);

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
        <LayoutGroup>
            <motion.section
                className="grid grid-cols-1 gap-5 xl:grid-cols-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, type: "tween" }}
                layout
            >
                <AnimatePresence initial={false} mode="wait">
                    {loading
                        ? new Array(3).fill(null).map((_, i) => (
                              <MotionCard key={i} className="col-span-1 xl:col-span-4" exit={{ opacity: 0 }}>
                                  <CardSkeleton numberOfSkeleton={1} isBig />
                                  <CardSkeleton numberOfSkeleton={6} />
                              </MotionCard>
                          ))
                        : pricingPageData?.map(
                              ({ _id, offerTitle, offerContent, isOfferCustom, monthlyPrice, fixedPrice }) => (
                                  <PricingCard
                                      key={_id}
                                      title={offerTitle}
                                      fixedPrice={fixedPrice}
                                      monthPrice={monthlyPrice}
                                      content={offerContent}
                                      isCustom={isOfferCustom}
                                  />
                              )
                          )}
                </AnimatePresence>
                <Card
                    className="item-center relative mt-5 flex flex-col items-center justify-center gap-3 p-10
                        opacity-100 backdrop-blur-xl xl:col-span-12"
                >
                    <CardHeader>
                        <h1 className="text-center text-xl font-semibold capitalize text-white xl:text-3xl">
                            Pour toutes autres questions / demandes
                        </h1>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link className="relative inline-flex w-full items-center gap-3 rounded-xl" href="#">
                                <span>Me contacter</span>
                                <span>
                                    <Send size={22} />
                                </span>
                            </Link>
                        </Button>
                    </CardContent>
                    <Blend
                        className="absolute right-1 top-1 rotate-90 stroke-muted-foreground opacity-50"
                        size={58}
                        strokeWidth={0.5}
                    />
                </Card>
            </motion.section>
        </LayoutGroup>
    );
}
