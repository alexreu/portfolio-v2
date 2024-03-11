"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import React from "react";

type Inputs = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
};

export default function ContactPage() {
    const {
        // register,
        handleSubmit,
        // formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = data => {
        console.log(data);
    };

    return (
        <section className="grid grid-cols-12">
            <div className="col-span-4 flex flex-col gap-5">
                <h1 className="font-semibold text-primary">Contact info</h1>
                <h2 className="text-4xl font-semibold text-white">Get in touch</h2>
                <p className="font-semibold text-muted-foreground">Don&apos;t be afraid !</p>
            </div>
            <Card className="col-span-8 p-8 opacity-100 backdrop-blur-xl">
                <CardContent className="p-0">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-5">
                            <Input type="name" placeholder="Nom / Prénom" />
                            <Input type="email" placeholder="john@doe.com" />
                            <Input type="phone" placeholder="XXX-XXX-XXX" />
                            <Input type="subjet" placeholder="Mon sujet" />
                            <Textarea rows={4} name="message" placeholder="Votre message" className="col-span-2" />
                        </div>
                        <Button type="submit" className="mt-5 inline-flex gap-2 rounded-full">
                            Envoyer
                            <MoveUpRight size={18} strokeWidth={3} />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}
