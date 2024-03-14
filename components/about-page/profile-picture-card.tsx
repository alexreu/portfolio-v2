import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Blend } from "lucide-react";
import React from "react";
import { AboutPageData } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { CardSkeleton } from "@/components/card-skeleton";

type Props = {
    isLoading: boolean;
    data?: AboutPageData["homePageData"]["profilePicture"];
};

export const ProfilePictureCard = ({ isLoading, data }: Props) => {
    const { image } = data ?? {};

    return (
        <Card
            className="relative order-first col-span-1 flex flex-col justify-center opacity-100 backdrop-blur-xl
                md:order-none xl:col-span-4"
        >
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, type: "tween" }}
                    >
                        <CardSkeleton numberOfSkeleton={1} skeletonClassName="!h-48 !w-48 rounded-full" />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, type: "tween" }}
                    >
                        <CardHeader>
                            <div className="mx-auto mt-6 h-48 w-48 rounded-full bg-primary">
                                {image && <Image src={image} alt="" width={192} height={192} />}
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
