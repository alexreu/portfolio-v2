import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const isValidPhoneNumber = (phone?: string) => {
    if (!phone) return true;

    const parsedPhoneNumber = parsePhoneNumberFromString(phone);
    return parsedPhoneNumber ? parsedPhoneNumber.isValid() : false;
};

export const contactFormSchema = z.object({
    name: z
        .string({
            required_error: "Champ requis",
            invalid_type_error: "Nom / Prénom doit être une chaine de caractère",
        })
        .min(1, { message: "Champ requis" })
        .max(150),
    email: z.string({ required_error: "Champs requis" }).email().min(1, { message: "Champ requis" }),
    phone: z
        .string()
        .optional()
        .refine(value => isValidPhoneNumber(value), { message: "Numéro de téléphone incorrect" }),
    subject: z.string({ required_error: "Champ requis" }).min(1, { message: "Champ requis" }).max(255),
    message: z.string({ required_error: "Champ requis" }).min(1, { message: "Champ requis" }).max(5000),
});
