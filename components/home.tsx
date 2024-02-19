"use client";

import React from "react";
import { ProfileCard } from "@/components/profile-card";
import { TitleCard } from "@/components/title-card";
import { SocialCard } from "@/components/social-card";
import { ExperienceCard } from "@/components/experience-card";
import { ServicesCard } from "@/components/services-card";
import { SkillsCard } from "@/components/skills-card";
import { GetInTouchCard } from "@/components/get-in-touch-card";
import { OffersCard } from "@/components/offers-card";

export const Home = () => {
    return (
        <div className=" grid w-full grid-cols-12 grid-rows-5 gap-5">
            <ProfileCard />
            <TitleCard />
            <SocialCard />
            <ExperienceCard />
            <ServicesCard />
            <SkillsCard />
            <GetInTouchCard />
            <OffersCard />
        </div>
    );
};
