import { PricingCard } from "@/components/pricing-card";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Blend } from "lucide-react";
import React from "react";

export default function Pricing() {
    return (
        <div className="grid grid-cols-12 gap-5">
            <PricingCard title="Offre basique" fixedPrice="499" monthPrice="45" content={[]} />
            <PricingCard title="Offre premium" fixedPrice="1299" monthPrice="64" content={[]} />
            <PricingCard title="Offre sur mesure" isCustom content={[]} />
            <Card className="relative col-span-12 flex flex-col items-center gap-6 opacity-100 backdrop-blur-xl">
                <CardHeader>
                    <h1 className="text-3xl font-semibold capitalize text-white">Pour toutes autres questions</h1>
                </CardHeader>
                <CardContent>
                    <Link
                        href="#"
                        className="inline-flex rounded-xl bg-primary px-4 py-3 text-xl font-medium tracking-wide
                            text-white"
                    >
                        Me contacter
                    </Link>
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
