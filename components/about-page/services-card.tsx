import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRight, Sparkles } from "lucide-react";
import React from "react";
import { AboutPageData } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { CardSkeleton } from "@/components/card-skeleton";

type Props = {
    isLoading: boolean;
    data?: AboutPageData["services"];
};

export const ServicesCard = ({ isLoading, data }: Props) => {
    return (
        <Card className="relative col-span-3 flex flex-col justify-center opacity-100 backdrop-blur-xl">
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
                        <CardHeader>
                            <h1 className="text-xl font-semibold leading-none tracking-tight text-primary">
                                What i do
                            </h1>
                        </CardHeader>
                        <CardContent>
                            <ul className="flex flex-col justify-center gap-5">
                                {data?.map(({ service, _key }) => (
                                    <li key={_key} className="flex gap-2 text-sm tracking-wide text-white">
                                        <ChevronRight />
                                        <p>{service}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <Sparkles
                            className="absolute right-1 top-1 rotate-90 stroke-muted-foreground opacity-50"
                            size={58}
                            strokeWidth={0.5}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
};
