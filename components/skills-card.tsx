import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import Autoplay from "embla-carousel-autoplay";
import { Code2, Database, Github, Gitlab, Terminal } from "lucide-react";

export const SkillsCard = ({ skills }) => {
    return (
        <Card className="order-6 col-span-1 opacity-100 backdrop-blur-xl lg:order-none lg:col-span-6 lg:row-span-1">
            <CardHeader>
                <h1 className="text-xl font-semibold leading-none tracking-tight text-primary">Skills & tools</h1>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                <Carousel
                    opts={{
                        loop: true,
                    }}
                    plugins={[Autoplay({}), AutoScroll({})]}
                >
                    <CarouselContent>
                        <CarouselItem className="md:basis-1/2 xl:basis-1/3">
                            <p className="rounded-lg border p-2 text-center text-xs text-muted lg:text-sm">
                                Developpement web
                            </p>
                        </CarouselItem>
                        <CarouselItem className="md:basis-1/2 xl:basis-1/3">
                            <p className="rounded-lg border p-2 text-center text-xs text-muted lg:text-sm">
                                Seo & Referencement
                            </p>
                        </CarouselItem>
                        <CarouselItem className="md:basis-1/2 xl:basis-1/3">
                            <p className="rounded-lg border p-2 text-center text-xs text-muted lg:text-sm">
                                Integration web
                            </p>
                        </CarouselItem>
                        <CarouselItem className="md:basis-1/2 xl:basis-1/3">
                            <p className="rounded-lg border p-2 text-center text-xs text-muted lg:text-sm">
                                Responsive
                            </p>
                        </CarouselItem>
                        <CarouselItem className="md:basis-1/2 xl:basis-1/3">
                            <p className="rounded-lg border p-2 text-center text-xs text-muted lg:text-sm">
                                Site vitrine
                            </p>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
                <Carousel
                    opts={{
                        loop: true,
                    }}
                    plugins={[Autoplay({}), AutoScroll({ direction: "backward" })]}
                >
                    <CarouselContent>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Github />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Gitlab />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Code2 />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Database />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Terminal />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Github />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Gitlab />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Github />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Gitlab />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Code2 />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Database />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Terminal />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Github />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Gitlab />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Code2 />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Database />
                            </span>
                        </CarouselItem>
                        <CarouselItem className="basis-1/5 lg:basis-1/6 xl:basis-1/12">
                            <span
                                className="inline-flex items-center justify-center rounded-lg border p-2 text-center
                                    text-sm text-muted"
                            >
                                <Terminal />
                            </span>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
            </CardContent>
        </Card>
    );
};
