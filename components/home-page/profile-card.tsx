import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { CardFooterLink } from "@/components/ui/card-footer-link";
import { Send, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

type Props = {
    firstname?: string;
    profilePicture?: { alt?: string; image?: string };
};

export const ProfileCard = ({ profilePicture, firstname }: Props) => {
    const MotionLink = motion.create(Link);

    const iconVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 },
    };
    const linkVariants = {
        hidden: { width: "153px" },
        visible: { width: "187px" },
    };

    return (
        <Card
            className="relative order-1 col-span-1 flex flex-col items-center opacity-100 backdrop-blur-xl lg:order-0
                lg:col-span-3 lg:col-start-1 lg:row-span-2 lg:row-start-1 xl:row-span-3"
        >
            <CardHeader className="mt-auto flex flex-col-reverse items-center gap-6">
                <h1>
                    <MotionLink
                        className="relative flex w-full items-center gap-3 rounded-xl bg-primary p-3 text-lg font-medium
                            tracking-wide text-white"
                        href="/contact"
                        initial="hidden"
                        whileHover="visible"
                        variants={linkVariants}
                        aria-label="formulaire de contact"
                    >
                        <span>I&#39;m {firstname}</span>
                        <motion.span
                            className="opacity-0 absolute right-3"
                            variants={iconVariants}
                            transition={{ 
                                duration: 0.3, 
                                type: "spring",
                                stiffness: 400,
                                damping: 25
                            }}
                        >
                            <Send size={22} />
                        </motion.span>
                    </MotionLink>
                </h1>
                {profilePicture?.image && (
                    <div className="mx-auto mt-6 h-40 w-40 rounded-full bg-primary">
                        <Image src={profilePicture.image} alt={profilePicture?.alt || `Photo de profil de ${firstname}`} width={160} height={160} />
                    </div>
                )}
            </CardHeader>
            <CardFooter className="mt-auto w-full">
                <CardFooterLink href="/about">A propos</CardFooterLink>
            </CardFooter>
            <Sparkles
                className="absolute right-1 top-1 rotate-90 animate-pulse stroke-muted-foreground"
                size={58}
                strokeWidth={0.5}
            />
        </Card>
    );
};
