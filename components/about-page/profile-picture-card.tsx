import { CardSkeleton } from "@/components/card-skeleton";
import { Card, CardHeader } from "@/components/ui/card";
import { AboutPageData } from "@/lib/types";
import { Blend, Square } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

type Props = {
    isLoading: boolean;
    data?: AboutPageData["homePageData"]["profilePicture"];
};

export const ProfilePictureCard = ({ isLoading, data }: Props) => {
    const { image } = data ?? {};

    return (
        <Card
            className="relative order-first col-span-1 flex flex-col justify-center opacity-100 backdrop-blur-xl
                md:order-0 xl:col-span-4"
        >
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, type: "tween" }}
                    >
                        <CardSkeleton numberOfSkeleton={1} skeletonClassName="h-48! w-48! rounded-full" />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, type: "tween" }}
                    >
                        <CardHeader>
                            <div
                                className="relative mx-auto inline-flex h-32 w-32 items-center justify-center border
                                    border-primary sm:h-56 sm:w-56"
                            >
                                <div className="h-32 w-32 rounded-full bg-primary sm:h-56 sm:w-56">
                                    {image && <Image src={image} alt="" width={224} height={224} />}
                                </div>
                                <Square fill="white" stroke="white" className="absolute -left-1.5 -top-1.5" size={12} />
                                <Square
                                    fill="white"
                                    stroke="white"
                                    className="absolute -right-1.5 -top-1.5"
                                    size={12}
                                />
                                <Square
                                    fill="white"
                                    stroke="white"
                                    className="absolute -bottom-1.5 -left-1.5"
                                    size={12}
                                />
                                <Square
                                    fill="white"
                                    stroke="white"
                                    className="absolute -bottom-1.5 -right-1.5"
                                    size={12}
                                />
                            </div>
                        </CardHeader>
                        <Blend
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
