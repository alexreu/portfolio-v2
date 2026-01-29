import { getHomepageData } from "@/lib/sanity/sanity.query";
import { HomePageContent } from "@/components/home-page/home-page-content";

export default async function Home() {
    const data = await getHomepageData();
    return <HomePageContent data={data[0]} />;
}
