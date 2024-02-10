import React, { Suspense } from "react";
import { ResumeWrapper } from "../../src/components/Resume";
import ressourceType from "../../src/enums/ResourceType";
import { getDirectoryPath } from "../../src/modules/getDirectoryPath/getDirectoryPath";
import { getJsonContent } from "../../src/modules/getJsonContent/getJsonContent";
import { Loader } from "../../src/components/Loader";
import { AboutResource, ProjectResource, ServicesResource } from "../page";

const getData = async () => {
    const { ABOUT, PROJECTS, SERVICES } = ressourceType;
    const jsonDirectory = getDirectoryPath("json");
    const { about } = (await getJsonContent(jsonDirectory, ABOUT)) as { about: AboutResource[] };
    const { services } = (await getJsonContent(jsonDirectory, SERVICES)) as { services: ServicesResource[] };
    const { projects } = (await getJsonContent(jsonDirectory, PROJECTS)) as { projects: ProjectResource[] };

    return { about, services, projects };
};

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Page() {
    const { about } = await getData();

    return (
        <Suspense fallback={<Loader />}>
            <ResumeWrapper data={about} />
        </Suspense>
    );
}
