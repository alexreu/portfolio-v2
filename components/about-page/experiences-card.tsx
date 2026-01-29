"use client";

import { ChevronsRight, Layers } from "lucide-react";
import { motion } from "motion/react";

import { AboutPageData } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {
    data: AboutPageData["experiences"];
};

export const ExperiencesCard = ({ data }: Props) => {
    return (
        <Card className="relative col-span-1 flex flex-col justify-center opacity-100 backdrop-blur-xl xl:col-span-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, type: "tween" }}
            >
                <CardHeader>
                    <h1 className="text-primary text-xl leading-none font-semibold tracking-tight">
                        Expériences
                    </h1>
                </CardHeader>
                <CardContent>
                    <ul className="flex flex-col justify-center gap-5">
                        {data.map(({ company, startYear, endYear, isCurrentJob, job, _key }) => (
                            <li
                                key={_key}
                                className="flex gap-1 text-sm tracking-wide text-white md:col-span-2"
                            >
                                <ChevronsRight size={20} />
                                <div className="flex flex-col justify-center gap-2">
                                    <p className="inline-flex gap-0.5">
                                        <span className="pr-1">{`${startYear} / ${!isCurrentJob ? endYear : "Now"}`}</span>
                                        <span className="relative before:absolute before:top-1/2 before:left-0 before:hidden before:h-px before:w-2 before:bg-white before:content-[''] xl:pr-1 xl:pl-3 xl:before:block">
                                            {job}
                                        </span>
                                    </p>
                                    <p>{company}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <Layers
                    className="stroke-muted-foreground absolute top-1 right-1 opacity-50"
                    size={58}
                    strokeWidth={0.5}
                />
            </motion.div>
        </Card>
    );
};
