"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { contactFormSchema } from "@/lib/schemas/contact-form-schema";

export const ContactForm = () => {
    const form = useForm<z.infer<typeof contactFormSchema>>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = (data: z.infer<typeof contactFormSchema>) => {
        console.log(data);
    };

    return (
        <Card className="col-span-8 p-16 opacity-100 backdrop-blur-xl">
            <CardContent className="p-0">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-8">
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => {
                                    console.log({ field });
                                    return (
                                        <FormItem className="flex flex-col gap-3 font-medium text-white">
                                            <FormLabel>Nom / Prénom</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nom / Prénom"
                                                    className="rounded-xl p-6 focus:border-primary"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
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
                                                className="rounded-xl p-6 focus:border-primary"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="phone"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-3 font-medium text-white">
                                        <FormLabel>Téléphone (optionnel)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="+262 123 456"
                                                className="rounded-xl p-6 focus:border-primary"
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
                                                placeholder="Votre sujet"
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
                                    <FormItem className="col-span-2 flex flex-col gap-3 font-medium text-white">
                                        <FormLabel>Votre message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Votre message"
                                                className="col-span-2 rounded-xl p-6 focus:border-primary"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="mt-5 inline-flex gap-2 rounded-full">
                            Envoyer
                            <MoveUpRight size={18} strokeWidth={3} />
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
