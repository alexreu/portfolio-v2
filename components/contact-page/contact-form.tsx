"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const isValidPhoneNumber = (phone: string) => {
    const parsedPhoneNumber = parsePhoneNumberFromString(phone);
    console.log(parsedPhoneNumber);
    return parsedPhoneNumber ? parsedPhoneNumber.isValid() : false;
};

export const ContactForm = () => {
    const contactFormSchema = z.object({
        name: z.string().min(1).max(150),
        email: z.string().email().min(1),
        phone: z.string().refine(value => isValidPhoneNumber(value), { message: "Numéro de téléphone incorrect" }),
        subject: z.string().min(1).max(255),
        message: z.string().min(1).max(5000),
    });

    const { handleSubmit, ...form } = useForm<z.infer<typeof contactFormSchema>>({
        resolver: zodResolver(contactFormSchema),
    });

    const onSubmit = (data: z.infer<typeof contactFormSchema>) => {
        console.log(data);
    };

    return (
        <Card className="col-span-8 p-16 opacity-100 backdrop-blur-xl">
            <CardContent className="p-0">
                <Form {...form} handleSubmit={handleSubmit}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-8">
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-3 font-medium text-white">
                                        <FormLabel htmlFor="name">Nom / Prénom</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Nom / Prénom"
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
                                        <FormLabel htmlFor="email">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                type="email"
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
                                        <FormLabel htmlFor="phone">Téléphone (optionnel)</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="phone"
                                                type="phone"
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
                                        <FormLabel htmlFor="sujet">Sujet</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="sujet"
                                                type="text"
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
                                        <FormLabel htmlFor="message">Votre message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                id="message"
                                                rows={4}
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
