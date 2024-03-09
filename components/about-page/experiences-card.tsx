import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronsRight, Layers } from "lucide-react";
import { AboutPageData } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { CardSkeleton } from "@/components/card-skeleton";

type Props = {
    isLoading: boolean;
    data?: AboutPageData["experiences"];
};

export const ExperiencesCard = ({ isLoading, data }: Props) => {
    return (
        <Card className="relative col-span-4 flex flex-col justify-center opacity-100 backdrop-blur-xl">
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
                                Expériences
                            </h1>
                        </CardHeader>
                        <CardContent>
                            <ul className="flex flex-col justify-center gap-5">
                                {data?.map(({ company, startYear, endYear, isCurrentJob, job, _key }) => (
                                    <li key={_key} className="flex gap-1 text-sm tracking-wide text-white">
                                        <ChevronsRight />
                                        <p className="inline-flex items-center gap-0.5">
                                            <span className="pr-1">{`${startYear} // ${!isCurrentJob ? endYear : "Now"}`}</span>
                                            <span
                                                className="relative pl-3 pr-1 before:absolute before:left-0
                                                    before:top-1/2 before:h-[1px] before:w-2 before:bg-white
                                                    before:content-['']"
                                            >
                                                {job}
                                            </span>
                                            <span
                                                className="relative pl-3 before:absolute before:left-0 before:top-1/2
                                                    before:h-[1px] before:w-2 before:bg-white before:content-['']"
                                            >
                                                {company}
                                            </span>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <Layers
                            className="absolute right-1 top-1 stroke-muted-foreground opacity-50"
                            size={58}
                            strokeWidth={0.5}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
};
