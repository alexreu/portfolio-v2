"use client";

import { ExperienceCard } from "@/components/experience-card";
import { GetInTouchCard } from "@/components/get-in-touch-card";
import { GlobalLoading } from "@/components/global-loading";
import { OffersCard } from "@/components/offers-card";
import { ProfileCard } from "@/components/profile-card";
import { ServicesCard } from "@/components/services-card";
import { SkillsCard } from "@/components/skills-card";
import { SocialCard } from "@/components/social-card";
import { TitleCard } from "@/components/title-card";
import { getHomepageData } from "@/lib/sanity/sanity.query";
import { HomepageData } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home() {
    const homepageData: HomepageData[] = await getHomepageData();
    const { firstname, job, keyFigures, skills, profilePicture } = homepageData[0];

    return (
        <AnimatePresence mode="wait">
            {homepageData ? (
                <motion.section
                    className="z-20 grid h-full w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, type: "tween" }}
                >
                    <ProfileCard profilePicture={profilePicture} firstname={firstname} />
                    <TitleCard job={job} />
                    <SocialCard />
                    <ExperienceCard keyFigures={keyFigures} />
                    <ServicesCard />
                    <SkillsCard skills={skills} />
                    <GetInTouchCard />
                    <OffersCard />
                </motion.section>
            ) : (
                <GlobalLoading />
            )}
        </AnimatePresence>
    );
}
