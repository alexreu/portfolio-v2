import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function About() {
    return (
        <div className="grid grid-cols-12 gap-5">
            <Card className="relative col-span-8 flex flex-col p-8 opacity-100 backdrop-blur-xl">
                <CardHeader>
                    <h1 className="inline-flex flex-col gap-3 text-3xl font-semibold tracking-wide text-white">
                        <span>Hello,</span>
                        <span> I’m Alexandre, a front end developer.</span>
                    </h1>
                </CardHeader>
                <CardContent>
                    <p className="text-base font-light text-white opacity-80">
                        Développeur front depuis 5 ans spécialisé dans l’intégration web et la création d’applications
                        web avec ReactJs. Je serais ravi de vous accompagner dans le développement de votre projet. Je
                        n’hésiterai pas à être force de proposition si nécessaire afin de vous aider dans la réalisation
                        de celui-ci. N’hésitez pas à me contacter, afin de discuter de votre projet, je serais ravi de
                        participer au développement de celui-ci ! À bientôt👋
                    </p>
                </CardContent>
                <Sparkles
                    className="absolute right-1 top-1 rotate-90 animate-pulse stroke-muted-foreground"
                    size={58}
                    strokeWidth={0.5}
                />
            </Card>
            <Card className="relative col-span-4 flex flex-col opacity-100 backdrop-blur-xl">
                <CardHeader>
                    <h1></h1>
                </CardHeader>
                <CardContent></CardContent>
            </Card>
        </div>
    );
}
