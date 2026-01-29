"use client";

import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

import { AboutPageData } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {
    data: AboutPageData["presentation"];
};

export const PresentationCard = ({ data }: Props) => {
    const { title, description } = data;

    return (
        <Card className="relative col-span-1 flex flex-col p-8 opacity-100 backdrop-blur-xl lg:col-span-2 xl:col-span-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, type: "tween" }}
                className="flex flex-col gap-4 lg:gap-0"
            >
                <CardHeader className="p-0 lg:p-6">
                    <h1 className="inline-flex flex-col gap-3 text-xl font-semibold tracking-wide text-white md:whitespace-pre-line lg:text-3xl">
                        {title}
                    </h1>
                </CardHeader>
                <CardContent className="p-0 lg:p-6">
                    <p className="text-base leading-relaxed font-light text-white opacity-80 lg:text-justify">
                        {description}
                    </p>
                </CardContent>
                <Sparkles
                    className="stroke-muted-foreground absolute top-1 right-1 rotate-90 animate-pulse"
                    size={58}
                    strokeWidth={0.5}
                />
            </motion.div>
        </Card>
    );
};
