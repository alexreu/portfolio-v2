"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoaderCircle, MoveUpRight } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { contactFormSchema } from "@/lib/schemas/contact-form-schema";
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

    const onSubmit = async (data: z.infer<typeof contactFormSchema>) => {
        setIsLoading(true);
        const sendEmail = async () =>
            await fetch("/api/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        sendEmail()
            .then(() => {
                setIsLoading(false);
                toast({
                    title: "Demande envoyée avec succès",
                });
            })
            .catch(error => {
                toast({
                    title: "Erreur lors de l'envoie du message. Veuillez reéssayer.",
                    description: error.message,
                    variant: "destructive",
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
                                                className="rounded-xl p-6 focus:border-primary"
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
                                                className="rounded-xl p-6 focus:border-primary"
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
                                                className="h-12 rounded-xl px-6 py-4 focus:border-primary"
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
                                                className="rounded-xl p-6 focus:border-primary"
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
                                                className="col-span-2 rounded-xl p-6 focus:border-primary"
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
                            className="mt-5 inline-flex gap-2 rounded-full focus-visible:outline-2
                                focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed"
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
