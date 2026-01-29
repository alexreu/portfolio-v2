"use client";

import { ExperienceCard } from "@/components/home-page/experience-card";
import { GetInTouchCard } from "@/components/home-page/get-in-touch-card";
import { OffersCard } from "@/components/home-page/offers-card";
import { ProfileCard } from "@/components/home-page/profile-card";
import { ServicesCard } from "@/components/home-page/services-card";
import { SkillsCard } from "@/components/home-page/skills-card";
import { SocialCard } from "@/components/home-page/social-card";
import { TitleCard } from "@/components/home-page/title-card";
import { HomepageData } from "@/lib/types";
import { motion } from "motion/react";

type Props = {
    data: HomepageData;
};

export const HomePageContent = ({ data }: Props) => {
    const { firstname, job, keyFigures, skills, profilePicture } = data;

    return (
        <motion.section
            className="z-20 grid h-full w-full grid-cols-1 place-items-stretch gap-5 md:grid-cols-2 lg:grid-cols-12
                xl:grid-rows-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "tween" }}
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
    );
};
