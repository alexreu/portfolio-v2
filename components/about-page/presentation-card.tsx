import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import React from "react";
import { AboutPageData } from "@/lib/types";
import { CardSkeleton } from "@/components/card-skeleton";
import { AnimatePresence, motion } from "framer-motion";

type Props = { isLoading: boolean; data?: AboutPageData["presentation"] };

export const PresentationCard = ({ data, isLoading }: Props) => {
    const { title, description } = data ?? {};

    return (
        <Card className="relative col-span-1 flex flex-col p-8 opacity-100 backdrop-blur-xl lg:col-span-2 xl:col-span-8">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, type: "tween" }}
                    >
                        <CardSkeleton numberOfSkeleton={8} />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, type: "tween" }}
                        className="flex flex-col gap-4 lg:gap-0"
                    >
                        <CardHeader className="p-0 md:p-6">
                            <h1
                                className="inline-flex flex-col gap-3 text-xl font-semibold tracking-wide text-white
                                    md:whitespace-pre-line md:text-3xl"
                            >
                                {title}
                            </h1>
                        </CardHeader>
                        <CardContent className="p-0 md:p-6">
                            <p className="text-base font-light leading-relaxed text-white opacity-80 md:text-justify">
                                {description}
                            </p>
                        </CardContent>
                        <Sparkles
                            className="absolute right-1 top-1 rotate-90 animate-pulse stroke-muted-foreground"
                            size={58}
                            strokeWidth={0.5}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
};
