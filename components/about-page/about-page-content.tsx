import { EducationCard } from "@/components/about-page/education-card";
import { ExperiencesCard } from "@/components/about-page/experiences-card";
import { KeyFigures } from "@/components/about-page/key-figures";
import { PresentationCard } from "@/components/about-page/presentation-card";
import { ProfilePictureCard } from "@/components/about-page/profile-picture-card";
import { ServicesCard } from "@/components/about-page/services-card";
import { GetInTouchCard } from "@/components/home-page/get-in-touch-card";
import { SocialCard } from "@/components/home-page/social-card";
import { AboutPageData } from "@/lib/types";

type Props = {
    data: AboutPageData;
};

export const AboutPageContent = ({ data }: Props) => {
    const { presentation, homePageData, experiences, services, education } = data;

    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12">
            <PresentationCard data={presentation} />
            <ProfilePictureCard data={homePageData.profilePicture} />
            <ExperiencesCard data={experiences} />
            <ServicesCard data={services} />
            <KeyFigures data={homePageData.keyFigures} />
            <SocialCard className="lg:col-span-1 lg:row-span-1 xl:col-span-3" />
            <EducationCard data={education} />
            <GetInTouchCard className="lg:col-span-2 xl:col-span-3" />
        </section>
    );
};
