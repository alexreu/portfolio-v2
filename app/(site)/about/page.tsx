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
        <div className="grid grid-cols-12 gap-5">
            <PresentationCard isLoading={loading} data={presentation} />
            <ProfilePictureCard isLoading={loading} data={homePageData?.profilePicture} />
            <ExperiencesCard isLoading={loading} data={experiences} />
            <ServicesCard isLoading={loading} data={services} />
            <KeyFigures isLoading={loading} data={homePageData?.keyFigures} />
            <SocialCard />
            <EducationCard isLoading={loading} data={education} />
            <GetInTouchCard />
        </div>
    );
}
