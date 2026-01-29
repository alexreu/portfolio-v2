"use client";

import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import { AboutPageData } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {
    data: AboutPageData["services"];
};

export const ServicesCard = ({ data }: Props) => {
    return (
        <Card className="relative col-span-1 flex flex-col justify-center opacity-100 backdrop-blur-xl xl:col-span-5">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, type: "tween" }}
            >
                <CardHeader>
                    <h1 className="text-primary text-xl leading-none font-semibold tracking-tight">
                        What i do
                    </h1>
                </CardHeader>
                <CardContent>
                    <ul className="flex flex-col justify-center gap-5">
                        {data.map(({ service, _key }) => (
                            <li key={_key} className="flex gap-2 text-sm tracking-wide text-white">
                                <ChevronRight />
                                <p>{service}</p>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <Sparkles
                    className="stroke-muted-foreground absolute top-1 right-1 rotate-90 opacity-50"
                    size={58}
                    strokeWidth={0.5}
                />
            </motion.div>
        </Card>
    );
};
