"use client";

import Image from "next/image";
import { Blend, Square } from "lucide-react";
import { motion } from "motion/react";

import { AboutPageData } from "@/lib/types";
import { Card, CardHeader } from "@/components/ui/card";

type Props = {
    data: AboutPageData["homePageData"]["profilePicture"];
};

export const ProfilePictureCard = ({ data }: Props) => {
    const { image } = data;

    return (
        <Card className="relative order-first col-span-1 flex flex-col justify-center opacity-100 backdrop-blur-xl md:order-0 xl:col-span-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, type: "tween" }}
            >
                <CardHeader>
                    <div className="border-primary relative mx-auto inline-flex h-32 w-32 items-center justify-center border sm:h-56 sm:w-56">
                        <div className="bg-primary h-32 w-32 rounded-full sm:h-56 sm:w-56">
                            {image && (
                                <Image src={image} alt="Photo de profil" width={224} height={224} />
                            )}
                        </div>
                        <Square
                            fill="white"
                            stroke="white"
                            className="absolute -top-1.5 -left-1.5"
                            size={12}
                        />
                        <Square
                            fill="white"
                            stroke="white"
                            className="absolute -top-1.5 -right-1.5"
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
                            className="absolute -right-1.5 -bottom-1.5"
                            size={12}
                        />
                    </div>
                </CardHeader>
                <Blend
                    className="stroke-muted-foreground absolute top-1 right-1 rotate-90 opacity-50"
                    size={58}
                    strokeWidth={0.5}
                />
            </motion.div>
        </Card>
    );
};
