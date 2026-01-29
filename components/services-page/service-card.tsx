"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {
    title: string;
    description: string;
    illustration: string;
};

export const ServiceCard = ({ title, description, illustration }: Props) => {
    return (
        <Card className="col-span-1 flex flex-col gap-5 p-8 opacity-100 backdrop-blur-xl xl:col-span-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, type: "tween" }}
            >
                <CardHeader className="flex flex-col gap-3">
                    <h1 className="text-primary inline-flex flex-col gap-1 text-2xl font-semibold">
                        {title}
                    </h1>
                    <div className="inline-flex h-32 items-center">
                        <Image src={illustration} alt={title} height={128} width={160} />
                    </div>
                </CardHeader>
                <CardContent className="mt-auto text-left text-base whitespace-pre-line text-white opacity-70 lg:text-justify">
                    <p>{description}</p>
                </CardContent>
            </motion.div>
        </Card>
    );
};
