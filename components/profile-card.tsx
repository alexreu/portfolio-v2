import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import { motion } from "framer-motion";

export const ProfileCard = () => {
    const MotionLink = motion(Link);
    const iconVariants = {
        initial: { display: "none", opacity: 0, translateX: -20 },
        hover: { display: "block", opacity: 1, translateX: 0 },
    };

    return (
        <Card
            className="col-span-3 col-start-1 row-span-2 row-start-1 flex flex-col items-center opacity-100
                backdrop-blur-xl"
        >
            <CardHeader className="flex flex-col items-center gap-6">
                <div
                    className="mx-auto mt-6 h-40 w-40 rounded-full bg-primary bg-[url('/images/resume-photo.png')]
                        bg-cover bg-center"
                ></div>
                <h1>
                    <MotionLink
                        className="inline-flex w-full items-center justify-between gap-3 rounded-xl bg-primary p-3
                            text-lg font-medium tracking-wide text-white transition-all duration-200 ease-in-out"
                        href="#"
                        whileHover="hover"
                        initial="initial"
                    >
                        <span>I'm Alexandre</span>
                        <motion.span variants={iconVariants}>
                            <Send size={22} />
                        </motion.span>
                    </MotionLink>
                </h1>
                {/*<CardDescription>Card Description</CardDescription>*/}
            </CardHeader>
            {/*<CardContent>*/}
            {/*    <p>Card Content</p>*/}
            {/*</CardContent>*/}
            <CardFooter className="mt-auto w-full">
                <Link
                    href="/contact"
                    className="inline-flex w-full justify-between font-medium text-white transition-all duration-200
                        ease-in-out hover:text-primary"
                >
                    <span>A propos</span>
                    <ArrowRight strokeWidth={1} />
                </Link>
            </CardFooter>
        </Card>
    );
};
