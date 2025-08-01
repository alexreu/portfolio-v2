import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import React from "react";
import { Sparkles } from "lucide-react";
import { CardFooterLink } from "@/components/ui/card-footer-link";

export const OffersCard = () => {
    return (
        <Card
            className="relarive order-8 col-span-1 flex flex-col justify-center opacity-100 backdrop-blur-xl
                lg:order-0 lg:col-span-3 lg:row-span-1 lg:justify-end xl:justify-center"
        >
            <CardHeader className="p-6 lg:p-3 xl:p-6">
                <h1
                    className="inline-flex flex-col gap-5 text-2xl font-semibold leading-none tracking-wide text-white
                        lg:text-xl xl:text-2xl"
                >
                    <span>Votre site vitrine</span>
                    <span className="ml-12 lg:ml-0 xl:ml-5">
                        à partir de <span className="text-primary">1300 €</span>
                    </span>
                </h1>
            </CardHeader>
            <CardFooter className="xl:mt-auto">
                <CardFooterLink href="/pricing" aria-label="consulter la page tarifs">
                    Mes offres
                </CardFooterLink>
            </CardFooter>
            <Sparkles
                className="absolute right-1 top-1 rotate-90 animate-pulse stroke-muted-foreground"
                size={58}
                strokeWidth={0.5}
            />
        </Card>
    );
};
