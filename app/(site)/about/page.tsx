import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Blend, ChevronRight, ChevronsRight, Layers, Sparkles } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function About() {
    return (
        <div className="grid grid-cols-12 gap-5">
            <Card className="relative col-span-8 flex flex-col p-8 opacity-100 backdrop-blur-xl">
                <CardHeader>
                    <h1 className="inline-flex flex-col gap-3 text-3xl font-semibold tracking-wide text-white">
                        <span>Hey,</span>
                        <span> Moi c&apos;est Alexandre, developpeur front. </span>
                    </h1>
                </CardHeader>
                <CardContent>
                    <p className="text-justify text-base font-light leading-relaxed text-white opacity-80">
                        Développeur front depuis 5 ans spécialisé dans l’intégration web et la création d’applications
                        web avec ReactJs. Je serais ravi de vous accompagner dans le développement de votre projet. Je
                        n’hésiterai pas à être force de proposition si nécessaire afin de vous aider dans la réalisation
                        de celui-ci. N’hésitez pas à me contacter, afin de discuter de votre projet, je serais ravi de
                        participer au développement de celui-ci ! À bientôt{" "}
                        <span className="inline-flex animate-bounce">👋</span>
                    </p>
                </CardContent>
                <Sparkles
                    className="absolute right-1 top-1 rotate-90 animate-pulse stroke-muted-foreground"
                    size={58}
                    strokeWidth={0.5}
                />
            </Card>
            <Card className="relative col-span-4 flex flex-col justify-center opacity-100 backdrop-blur-xl">
                <CardHeader>
                    <div className="mx-auto mt-6 h-40 w-40 rounded-full bg-primary">
                        <Image src="/images/resume-photo.png" alt="" width={160} height={160} />
                    </div>
                </CardHeader>
                <Blend
                    className="absolute right-1 top-1 rotate-90 stroke-muted-foreground opacity-50"
                    size={58}
                    strokeWidth={0.5}
                />
            </Card>
            <Card className="relative col-span-4 flex flex-col justify-center opacity-100 backdrop-blur-xl">
                <CardHeader>
                    <h1 className="text-xl font-semibold leading-none tracking-tight text-primary">Expériences</h1>
                </CardHeader>
                <CardContent>
                    <ul className="flex flex-col justify-center gap-5">
                        <li className="flex gap-2 text-sm tracking-wide text-white opacity-60">
                            <ChevronsRight />
                            <p className="inline-flex items-center gap-0.5">
                                <span className="pr-1">2022 // Now</span>
                                <span
                                    className="relative pl-3 pr-1 before:absolute before:left-0 before:top-1/2
                                        before:h-[1px] before:w-2 before:bg-white before:content-['']"
                                >
                                    Developpeur front
                                </span>
                                <span
                                    className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:h-[1px]
                                        before:w-2 before:bg-white before:content-['']"
                                >
                                    Simplon.co
                                </span>
                            </p>
                        </li>
                        <li className="flex gap-2 text-sm text-white opacity-60">
                            <ChevronsRight />
                            <p className="inline-flex items-center gap-0.5">
                                <span className="pr-1">2018 // 2022</span>
                                <span
                                    className="relative pl-3 pr-1 before:absolute before:left-0 before:top-1/2
                                        before:h-[1px] before:w-2 before:bg-white before:content-['']"
                                >
                                    Developpeur front
                                </span>
                                <span
                                    className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:h-[1px]
                                        before:w-2 before:bg-white before:content-['']"
                                >
                                    Simplon.Prod
                                </span>
                            </p>
                        </li>
                        <li className="flex gap-2 text-sm text-white opacity-60">
                            <ChevronsRight />
                            <p className="inline-flex items-center gap-0.5">
                                <span className="pr-1">2015 // 2017</span>
                                <span
                                    className="relative pl-3 pr-1 before:absolute before:left-0 before:top-1/2
                                        before:h-[1px] before:w-2 before:bg-white before:content-['']"
                                >
                                    Technicien réseaux
                                </span>
                                <span
                                    className="relative pl-3 before:absolute before:left-0 before:top-1/2 before:h-[1px]
                                        before:w-2 before:bg-white before:content-['']"
                                >
                                    AtoutPc&apos;s
                                </span>
                            </p>
                        </li>
                    </ul>
                </CardContent>
                <Layers
                    className="absolute right-1 top-1 stroke-muted-foreground opacity-50"
                    size={58}
                    strokeWidth={0.5}
                />
            </Card>
            <Card className="relative col-span-3 flex flex-col justify-center opacity-100 backdrop-blur-xl">
                <CardHeader>
                    <h1 className="text-xl font-semibold leading-none tracking-tight text-primary">What i do</h1>
                </CardHeader>
                <CardContent>
                    <ul className="flex flex-col justify-center gap-5">
                        <li className="flex gap-2 text-sm tracking-wide text-white opacity-60">
                            <ChevronRight />
                            <p>Developpement front</p>
                        </li>
                        <li className="flex gap-2 text-sm tracking-wide text-white opacity-60">
                            <ChevronRight />
                            <p>Integration web</p>
                        </li>
                        <li className="flex gap-2 text-sm tracking-wide text-white opacity-60">
                            <ChevronRight />
                            <p>Développement back</p>
                        </li>
                        <li className="flex gap-2 text-sm tracking-wide text-white opacity-60">
                            <ChevronRight />
                            <p>SEO & Referencement simple</p>
                        </li>
                    </ul>
                </CardContent>
                <Sparkles
                    className="absolute right-1 top-1 rotate-90 stroke-muted-foreground opacity-50"
                    size={58}
                    strokeWidth={0.5}
                />
            </Card>
            <Card className="relative col-span-5 flex flex-col justify-center opacity-100 backdrop-blur-xl">
                <CardHeader>
                    <h1>Chiffres clés</h1>
                </CardHeader>
            </Card>
            <Card className="relative col-span-3 flex flex-col justify-center opacity-100 backdrop-blur-xl">
                <CardHeader>
                    <h1>Social links</h1>
                </CardHeader>
            </Card>
            <Card className="relative col-span-6 flex flex-col justify-center opacity-100 backdrop-blur-xl">
                <CardHeader>
                    <h1>Education</h1>
                </CardHeader>
            </Card>
            <Card className="relative col-span-3 flex flex-col justify-center opacity-100 backdrop-blur-xl">
                <CardHeader>
                    <h1>Get in touch</h1>
                </CardHeader>
            </Card>
        </div>
    );
}
