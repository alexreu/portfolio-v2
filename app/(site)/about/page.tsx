"use client";

import React, { useEffect, useState } from "react";
import { PresentationCard } from "@/components/about-page/presentation-card";
import { ProfilePictureCard } from "@/components/about-page/profile-picture-card";
import { ExperiencesCard } from "@/components/about-page/experiences-card";
import { ServicesCard } from "@/components/about-page/services-card";
import { KeyFigures } from "@/components/about-page/key-figures";
import { SocialCard } from "@/components/home-page/social-card";
import { EducationCard } from "@/components/about-page/education-card";
import { GetInTouchCard } from "@/components/home-page/get-in-touch-card";
import { getAboutPageData } from "@/lib/sanity/sanity.query";
import { AboutPageData } from "@/lib/types";
import { motion } from "framer-motion";

export default function About() {
    const [aboutPageData, setAboutPageData] = useState<AboutPageData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAboutPageData();
                setAboutPageData(data);
            } catch (error) {
                console.error("Error fetching about data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const { presentation, homePageData, experiences, services, education } = aboutPageData ?? {};

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "tween" }}
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12"
        >
            <PresentationCard isLoading={loading} data={presentation} />
            <ProfilePictureCard isLoading={loading} data={homePageData?.profilePicture} />
            <ExperiencesCard isLoading={loading} data={experiences} />
            <ServicesCard isLoading={loading} data={services} />
            <KeyFigures isLoading={loading} data={homePageData?.keyFigures} />
            <SocialCard className="lg:col-span-1 lg:row-span-1" />
            <EducationCard isLoading={loading} data={education} />
            <GetInTouchCard />
        </motion.section>
    );
}
