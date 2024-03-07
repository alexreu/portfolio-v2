import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import React from "react";

export const PresentationCard = () => {
    return (
        <Card className="relative col-span-8 flex flex-col p-8 opacity-100 backdrop-blur-xl">
            <CardHeader>
                <h1 className="inline-flex flex-col gap-3 text-3xl font-semibold tracking-wide text-white">
                    <span>Hey,</span>
                    <span> Moi c&apos;est Alexandre, developpeur front. </span>
                </h1>
            </CardHeader>
            <CardContent>
                <p className="text-justify text-base font-light leading-relaxed text-white opacity-80">
                    Développeur front depuis 5 ans spécialisé dans l’intégration web et la création d’applications web
                    avec ReactJs. Je serais ravi de vous accompagner dans le développement de votre projet. Je
                    n’hésiterai pas à être force de proposition si nécessaire afin de vous aider dans la réalisation de
                    celui-ci. N’hésitez pas à me contacter, afin de discuter de votre projet, je serais ravi de
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
    );
};
