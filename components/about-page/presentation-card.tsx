import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import React from "react";
import { AboutPageData } from "@/lib/types";
import { CardSkeleton } from "@/components/card-skeleton";
import { AnimatePresence, motion } from "framer-motion";

type Props = { isLoading: boolean } & Pick<AboutPageData, "presentation">;

export const PresentationCard = ({ presentation, isLoading }: Props) => {
    console.log({ presentation });
    return (
        <Card className="relative col-span-8 flex flex-col p-8 opacity-100 backdrop-blur-xl">
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
                    >
                        <CardHeader>
                            <h1 className="inline-flex flex-col gap-3 text-3xl font-semibold tracking-wide text-white">
                                {presentation.title}
                            </h1>
                        </CardHeader>
                        <CardContent>
                            <p className="text-justify text-base font-light leading-relaxed text-white opacity-80">
                                {presentation.description}
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
