"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircle, MoveUpRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { contactFormSchema } from "@/lib/schemas/contact-form-schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export const ContactForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof contactFormSchema>>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const sendEmail = async (data: z.infer<typeof contactFormSchema>) =>
        await fetch("/api/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

    const onSubmit = async (data: z.infer<typeof contactFormSchema>) => {
        setIsLoading(true);
        sendEmail(data)
            .then(() => {
                setIsLoading(false);
                toast({
                    description: (
                        <span className="inline-flex items-center gap-2 font-medium">
                            Demande envoyée avec succès <Check stroke="stroke-primary" size={16} />
                        </span>
                    ),
                });
            })
            .catch(() => {
                toast({
                    variant: "destructive",
                    description: (
                        <span className="inline-flex items-center gap-2 font-medium">
                            Erreur de l&apos;envoie. Veuillez reéssayer.
                        </span>
                    ),
                });
            });
    };

    return (
        <Card className="col-span-1 mt-10 p-8 opacity-100 backdrop-blur-xl lg:col-span-2 xl:col-span-8 xl:mt-0 xl:p-16">
            <CardContent className="p-0">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                            <FormField
                                name="lastname"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-3 font-medium text-white">
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Prénom"
                                                className="focus:border-primary rounded-xl p-6"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="firstname"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-3 font-medium text-white">
                                        <FormLabel>Prénom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Prénom"
                                                className="focus:border-primary rounded-xl p-6"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-3 font-medium text-white">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="john@doe.com"
                                                className="focus:border-primary h-12 rounded-xl px-6 py-4"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="subject"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-3 font-medium text-white">
                                        <FormLabel>Sujet</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Quel est votre demande"
                                                className="focus:border-primary rounded-xl p-6"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="message"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-3 font-medium text-white xl:col-span-2">
                                        <FormLabel>Votre message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Votre message"
                                                className="focus:border-primary col-span-2 rounded-xl p-6"
                                                rows={6}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="focus-visible:outline-primary mt-5 inline-flex gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            Envoyer
                            {isLoading ? (
                                <LoaderCircle className="animate-spin stroke-white" />
                            ) : (
                                <MoveUpRight size={18} strokeWidth={3} />
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
