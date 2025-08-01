import { z } from "zod";

export const contactFormSchema = z.strictObject({
    lastname: z
        .string({ error: "Nom / Prénom doit être une chaine de caractère" })
        .min(1, { error: "Champ requis" })
        .max(100),
    firstname: z
        .string({ error: "Nom / Prénom doit être une chaine de caractère" })
        .min(1, { error: "Champ requis" })
        .max(100),
    email: z.email({ error: "Email invalide" }).min(1, { error: "Champ requis" }),
    subject: z.string().min(1, { error: "Champ requis" }).max(255),
    message: z.string().min(1, { error: "Champ requis" }).max(5000),
}).required();
