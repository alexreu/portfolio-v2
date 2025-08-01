"use client";

import { CardSkeleton } from "@/components/card-skeleton";
import { PricingCard } from "@/components/pricing-page/pricing-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPricingPageData } from "@/lib/sanity/sanity.query";
import { PricingPageData } from "@/lib/types";
import { Blend, Send } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
                className="grid grid-cols-1 place-content-center gap-5 xl:grid-cols-12"
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
                    className="item-center relative col-span-1 mt-5 flex flex-col items-center justify-center gap-3 p-10
                        opacity-100 backdrop-blur-xl xl:col-span-12"
                >
                    <CardHeader>
                        <h1 className="text-center text-xl font-semibold capitalize text-white xl:text-3xl">
                            Pour toutes autres questions / demandes
                        </h1>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link
                                className="relative inline-flex w-full items-center gap-3 rounded-xl
                                    focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                                href="/contact"
                            >
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

                <ul className="col-span-1 flex flex-col gap-1.5 text-sm font-light text-white xl:col-span-12">
                    <li className="inline-flex items-center gap-2 before:text-base before:content-['*']">
                        Les tarifs indiqués sont des estimations et peuvent varier en fonction de la complexité du
                        projet.
                    </li>
                    <li className="ml-4">
                        Un devis personnalisé sera établi après discussion approfondie de vos besoins.
                    </li>
                    <li className="ml-4">
                        La maintenance mensuelle inclut la correction de bugs, l&apos;ajout de petites fonctionnalités
                        et la mise à jour des technologies.
                    </li>
                    <li className="ml-4">Des forfaits de maintenance plus complets peuvent être proposés.</li>
                </ul>
            </motion.section>
        </LayoutGroup>
    );
}
