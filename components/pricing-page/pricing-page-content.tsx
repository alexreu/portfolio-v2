import Link from "next/link";
import { Blend, Send } from "lucide-react";

import { PricingPageData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PricingCard } from "@/components/pricing-page/pricing-card";

type Props = {
    pricingData: PricingPageData[];
};

export const PricingPageContent = ({ pricingData }: Props) => {
    return (
        <section className="grid grid-cols-1 place-content-center gap-5 xl:grid-cols-12">
            {pricingData.map(
                ({ _id, offerTitle, offerContent, isOfferCustom, monthlyPrice, fixedPrice }) => (
                    <PricingCard
                        key={_id}
                        title={offerTitle}
                        fixedPrice={fixedPrice}
                        monthPrice={monthlyPrice}
                        content={offerContent}
                        isCustom={isOfferCustom}
                    />
                ),
            )}
            <Card className="item-center relative col-span-1 mt-5 flex flex-col items-center justify-center gap-3 p-10 opacity-100 backdrop-blur-xl xl:col-span-12">
                <CardHeader>
                    <h1 className="text-center text-xl font-semibold text-white capitalize xl:text-3xl">
                        Pour toutes autres questions / demandes
                    </h1>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link
                            className="focus-visible:outline-primary relative inline-flex w-full items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4"
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
                    className="stroke-muted-foreground absolute top-1 right-1 rotate-90 opacity-50"
                    size={58}
                    strokeWidth={0.5}
                />
            </Card>

            <ul className="col-span-1 flex flex-col gap-1.5 text-sm font-light text-white xl:col-span-12">
                <li className="inline-flex items-center gap-2 before:text-base before:content-['*']">
                    Les tarifs indiqués sont des estimations et peuvent varier en fonction de la
                    complexité du projet.
                </li>
                <li className="ml-4">
                    Un devis personnalisé sera établi après discussion approfondie de vos besoins.
                </li>
                <li className="ml-4">
                    La maintenance mensuelle inclut la correction de bugs, l&apos;ajout de petites
                    fonctionnalités et la mise à jour des technologies.
                </li>
                <li className="ml-4">
                    Des forfaits de maintenance plus complets peuvent être proposés.
                </li>
            </ul>
        </section>
    );
};
