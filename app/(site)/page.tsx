"use client";

import { ExperienceCard } from "@/components/home-page/experience-card";
import { GetInTouchCard } from "@/components/home-page/get-in-touch-card";
import { GlobalLoading } from "@/components/global-loading";
import { OffersCard } from "@/components/home-page/offers-card";
import { ProfileCard } from "@/components/home-page/profile-card";
import { ServicesCard } from "@/components/home-page/services-card";
import { SkillsCard } from "@/components/home-page/skills-card";
import { SocialCard } from "@/components/home-page/social-card";
import { TitleCard } from "@/components/home-page/title-card";
import { getHomepageData } from "@/lib/sanity/sanity.query";
import { HomepageData } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// eslint-disable-next-line @next/next/no-async-client-component
export default function Home() {
    const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: HomepageData[] = await getHomepageData();
                setHomepageData(data[0]);
            } catch (error) {
                console.error("Error fetching homepage data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const { firstname, job, keyFigures, skills, profilePicture } = homepageData ?? {};

    if (loading)
        return (
            <AnimatePresence initial={false}>
                <GlobalLoading />
            </AnimatePresence>
        );

    return (
        <AnimatePresence>
            <motion.section
                className="z-20 grid h-full w-full grid-cols-1 place-items-stretch gap-5 md:grid-cols-2 lg:grid-cols-12
                    lg:grid-rows-4"
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
        </AnimatePresence>
    );
}
