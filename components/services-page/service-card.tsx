import { CardSkeleton } from "@/components/card-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

type Props = {
    title: string;
    description: string;
    illustration: string;
    isLoading: boolean;
};

export const ServiceCard = ({ isLoading, title, description, illustration }: Props) => {
    return (
        <Card className="col-span-1 flex flex-col gap-5 p-8 opacity-100 backdrop-blur-xl xl:col-span-6">
            <AnimatePresence>
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
                        <CardHeader className="flex flex-col gap-3">
                            <h1 className="inline-flex flex-col gap-1 text-2xl font-semibold text-primary">{title}</h1>
                            <div className="inline-flex h-32 items-center">
                                <Image src={illustration} alt="" height={128} width={160} />
                            </div>
                        </CardHeader>
                        <CardContent
                            className="mt-auto whitespace-pre-line text-left text-base text-white opacity-70
                                lg:text-justify"
                        >
                            <p>{description}</p>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
};
