"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { ProfileCard } from "@/components/profile-card";
import { TitleCard } from "@/components/title-card";
import { SocialCard } from "@/components/social-card";
import { ExperienceCard } from "@/components/experience-card";
import { ServicesCard } from "@/components/services-card";
import { SkillsCard } from "@/components/skills-card";

export const Home = () => {
    return (
        <div className=" grid w-full grid-cols-12 grid-rows-5 gap-5">
            <ProfileCard />
            <TitleCard />
            <SocialCard />
            <ExperienceCard />
            <ServicesCard />
            <SkillsCard />
            {/* <Card className="col-span-4 col-start-9 row-span-2 row-start-2 opacity-100 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-primary">Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
            </Card> */}
            {/*<Card className="col-span-6 row-span-1 opacity-100 backdrop-blur-xl">*/}
            {/*    <CardHeader>*/}
            {/*        <CardTitle className="text-primary">Card Title</CardTitle>*/}
            {/*        <CardDescription>Card Description</CardDescription>*/}
            {/*    </CardHeader>*/}
            {/*</Card>*/}
            <Card className="col-span-6 row-span-1 opacity-100 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-primary">Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
};
