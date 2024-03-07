import React from "react";
import { PresentationCard } from "@/components/about-page/presentation-card";
import { ProfilePictureCard } from "@/components/about-page/profile-picture-card";
import { ExperiencesCard } from "@/components/about-page/experiences-card";
import { SkillsCard } from "@/components/about-page/skills-card";
import { KeyFigures } from "@/components/about-page/key-figures";
import { SocialCard } from "@/components/home-page/social-card";
import { EducationCard } from "@/components/about-page/education-card";
import { GetInTouchCard } from "@/components/home-page/get-in-touch-card";

export default function About() {
    return (
        <div className="grid grid-cols-12 gap-5">
            <PresentationCard />
            <ProfilePictureCard />
            <ExperiencesCard />
            <SkillsCard />
            <KeyFigures />
            <SocialCard />
            <EducationCard />
            <GetInTouchCard />
            {/*<Card className="relative col-span-3 flex flex-col justify-center opacity-100 backdrop-blur-xl">*/}
            {/*    <CardHeader>*/}
            {/*        <h1>Social links</h1>*/}
            {/*    </CardHeader>*/}
            {/*</Card>*/}
            {/*<Card className="relative col-span-6 flex flex-col justify-center opacity-100 backdrop-blur-xl">*/}
            {/*    <CardHeader>*/}
            {/*        <h1>Education</h1>*/}
            {/*    </CardHeader>*/}
            {/*</Card>*/}
            {/*<Card className="relative col-span-3 flex flex-col justify-center opacity-100 backdrop-blur-xl">*/}
            {/*    <CardHeader>*/}
            {/*        <h1>Get in touch</h1>*/}
            {/*    </CardHeader>*/}
            {/*</Card>*/}
        </div>
    );
}
