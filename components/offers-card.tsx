import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { MoveRight, Sparkles } from "lucide-react";

export const OffersCard = () => {
    return (
        <Card
            className="relarive order-8 col-span-1 flex flex-col opacity-100 backdrop-blur-xl lg:order-none
                lg:col-span-3 lg:row-span-1 lg:justify-center"
        >
            <CardHeader>
                <h1
                    className="inline-flex flex-col gap-5 text-2xl font-semibold leading-none tracking-wide text-white
                        lg:text-xl xl:text-2xl"
                >
                    <span>Votre site vitrine</span>
                    <span className="ml-12 lg:ml-0 xl:ml-5">
                        à partir de <span className="text-primary">499 €</span>
                    </span>
                </h1>
            </CardHeader>
            <CardFooter className="xl:mt-auto">
                <Link
                    href="/pricing"
                    className="inline-flex w-full justify-between py-2 font-medium text-white transition-all
                        duration-200 ease-in-out hover:text-primary"
                >
                    Mes offres
                    <MoveRight strokeWidth={1} />
                </Link>
            </CardFooter>
            <Sparkles
                className="absolute right-1 top-1 rotate-90 animate-pulse stroke-muted-foreground"
                size={58}
                strokeWidth={0.5}
            />
        </Card>
    );
};
