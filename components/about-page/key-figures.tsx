import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { AboutPageData } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { CardSkeleton } from "@/components/card-skeleton";

type Props = {
    isLoading: boolean;
    data?: AboutPageData["homePageData"]["keyFigures"];
};

export const KeyFigures = ({ isLoading, data }: Props) => {
    return (
        <Card className="relative col-span-1 flex flex-col justify-center opacity-100 backdrop-blur-xl xl:col-span-5">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, type: "tween" }}
                    >
                        <CardSkeleton numberOfSkeleton={5} />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, type: "tween" }}
                    >
                        <CardContent className="pt-6">
                            <ul className="grid grid-cols-2 gap-8">
                                {data?.map(({ keyFigure, keyFigureDescription, _key }) => (
                                    <li
                                        key={_key}
                                        className="col-span-1 flex flex-col items-start justify-start gap-2 text-left"
                                    >
                                        <span className="text-4xl font-medium tracking-normal text-white xl:text-5xl">
                                            {keyFigure}
                                        </span>
                                        <span className="text-xs uppercase text-muted-foreground xl:text-base">
                                            {keyFigureDescription}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
};
