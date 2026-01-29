"use client";

import { motion } from "motion/react";

import { AboutPageData } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
    data: AboutPageData["homePageData"]["keyFigures"];
};

export const KeyFigures = ({ data }: Props) => {
    return (
        <Card className="relative col-span-1 flex flex-col justify-center opacity-100 backdrop-blur-xl xl:col-span-3">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, type: "tween" }}
            >
                <CardContent className="pt-6">
                    <ul className="flex items-center justify-center gap-8">
                        {data.map(({ keyFigure, keyFigureDescription, _key }) => (
                            <li
                                key={_key}
                                className="flex flex-col items-center justify-center gap-2 text-center"
                            >
                                <span className="text-4xl font-medium tracking-normal text-white xl:text-5xl">
                                    {keyFigure}
                                </span>
                                <span className="text-muted-foreground text-xs uppercase xl:text-base">
                                    {keyFigureDescription}
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </motion.div>
        </Card>
    );
};
