"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProfileCard } from "@/components/profile-card";
import { TitleCard } from "@/components/title-card";
import { SocialCard } from "@/components/social-card";
import { ExperienceCard } from "@/components/experience-card";
import { ServicesCard } from "@/components/services-card";
import { SkillsCard } from "@/components/skills-card";
import { GetInTouchCard } from "@/components/get-in-touch-card";
import { OffersCard } from "@/components/offers-card";

type HomepageContent = {
    _id: string;
    job: string;
    number_of_happy_customers: number;
    number_of_projects: number;
    years_of_experiences: number;
};

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Page() {
    // const homepageContent = await client.fetch<HomepageContent[]>(`*[_type == "homepage"]`);

    // console.log(homepageContent);

    return (
        <AnimatePresence mode="wait">
            <motion.section
                className="z-20 grid h-full w-full grid-cols-1 gap-5 pb-5 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, type: "tween" }}
            >
                <ProfileCard />
                <TitleCard />
                <SocialCard />
                <ExperienceCard />
                <ServicesCard />
                <SkillsCard />
                <GetInTouchCard />
                <OffersCard />
            </motion.section>
        </AnimatePresence>
    );
}
