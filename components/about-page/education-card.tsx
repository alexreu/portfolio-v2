import { CardSkeleton } from "@/components/card-skeleton";
import { CardTitle } from "@/components/card-title";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AboutPageData } from "@/lib/types";
import { AnimatePresence, motion } from "motion/react";

type Props = {
    isLoading: boolean;
    data?: AboutPageData["education"];
};

export const EducationCard = ({ isLoading, data }: Props) => {
    return (
        <Card
            className="relative col-span-1 flex flex-col justify-center opacity-100 backdrop-blur-xl lg:order-last
                lg:col-span-3 xl:order-0 xl:col-span-6"
        >
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, type: "tween" }}
                    >
                        <CardSkeleton numberOfSkeleton={6} />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, type: "tween" }}
                    >
                        <CardHeader>
                            <CardTitle>Education</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-2 gap-y-6">
                                {data?.map(({ _key, yearOfGraduation, graduationTitle, trainingLocation }) => (
                                    <li key={_key} className="col-span-1 flex flex-col">
                                        <span className="text-xs text-muted-foreground lg:text-base">
                                            {yearOfGraduation}
                                        </span>
                                        <span className="text-base text-white lg:text-xl">{graduationTitle}</span>
                                        <span className="text-xs text-muted-foreground lg:text-base">
                                            {trainingLocation}
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
