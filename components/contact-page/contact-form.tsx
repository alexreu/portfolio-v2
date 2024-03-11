import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
};

export const ContactForm = () => {
    const {
        // register,
        handleSubmit,
        // formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = data => {
        console.log(data);
    };
    return (
        <Card className="col-span-8 p-16 opacity-100 backdrop-blur-xl">
            <CardContent className="p-0">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3 font-medium text-white">
                            <Label htmlFor="name">Nom / Prénom</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Nom / Prénom"
                                className="rounded-xl p-6 focus:border-primary"
                            />
                        </div>
                        <div className="flex flex-col gap-3 font-medium text-white">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@doe.com"
                                className="rounded-xl p-6 focus:border-primary"
                            />
                        </div>
                        <div className="flex flex-col gap-3 font-medium text-white">
                            <Label htmlFor="phone">Téléphone (optionnel)</Label>
                            <Input
                                id="phone"
                                type="phone"
                                placeholder="+262 123 456"
                                className="rounded-xl p-6 focus:border-primary"
                            />
                        </div>
                        <div className="flex flex-col gap-3 font-medium text-white">
                            <Label htmlFor="sujet">Sujet</Label>
                            <Input
                                id="sujet"
                                type="text"
                                placeholder="Votre sujet"
                                className="rounded-xl p-6 focus:border-primary"
                            />
                        </div>
                        <div className="col-span-2 flex flex-col gap-3 font-medium text-white">
                            <Label htmlFor="message">Votre message</Label>
                            <Textarea
                                id="message"
                                name="message"
                                rows={4}
                                placeholder="Votre message"
                                className="col-span-2 rounded-xl p-6 focus:border-primary"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="mt-5 inline-flex gap-2 rounded-full">
                        Envoyer
                        <MoveUpRight size={18} strokeWidth={3} />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
