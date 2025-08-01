import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import Autoplay from "embla-carousel-autoplay";
import {
    Chrome,
    Code2,
    Contrast,
    Database,
    Figma,
    Framer,
    Github,
    Gitlab,
    Linkedin,
    PersonStanding,
    Terminal,
} from "lucide-react";

type Props = {
    skills?: { skill: string; _key: string }[];
};

export const SkillsCard = ({ skills }: Props) => {
    const tools = {
        linkedin: <Linkedin />,
        code2: <Code2 />,
        gitlab: <Gitlab />,
        github: <Github />,
        figma: <Figma />,
        chrome: <Chrome />,
        framer: <Framer />,
        contrast: <Contrast />,
        accessibility: <PersonStanding />,
        database: <Database />,
        Terminal: <Terminal />,
    };

    return (
        <Card
            className=" order-6 col-span-1 flex flex-col opacity-100 backdrop-blur-xl lg:order-0 lg:col-span-6
                lg:row-span-1"
        >
            <CardHeader className="w-full self-start">
                <h1 className="text-xl font-semibold leading-none tracking-tight text-primary">
                    Skills & tools <span className="sr-only">compétences et outils</span>
                </h1>
            </CardHeader>
            <CardContent className="my-auto flex flex-col">
                <div className="flex flex-col gap-8">
                    {skills && (
                        <Carousel
                            opts={{
                                loop: true,
                            }}
                            plugins={[Autoplay({}), AutoScroll({ speed: 1 })]}
                        >
                            <CarouselContent>
                                {skills.map(({ skill, _key }) => (
                                    <CarouselItem key={_key} className="basis-1/3 md:basis-1/2 xl:basis-1/4">
                                        <p className="rounded-lg border p-2 text-center text-xs text-muted lg:text-sm">
                                            {skill}
                                        </p>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    )}
                    <Carousel
                        opts={{
                            loop: true,
                        }}
                        plugins={[Autoplay({}), AutoScroll({ direction: "backward", speed: 1 })]}
                    >
                        <CarouselContent>
                            {Object.entries(tools).map(([key, tool]) => (
                                <CarouselItem key={key} className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                                    <span
                                        className="inline-flex items-center justify-center rounded-lg border p-2
                                            text-center text-sm text-muted"
                                    >
                                        {tool}
                                    </span>
                                </CarouselItem>
                            ))}
                            {Object.entries(tools).map(([key, tool]) => (
                                <CarouselItem key={key} className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                                    <span
                                        className="inline-flex items-center justify-center rounded-lg border p-2
                                            text-center text-sm text-muted"
                                    >
                                        {tool}
                                    </span>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </CardContent>
        </Card>
    );
};
