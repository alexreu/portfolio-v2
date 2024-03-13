import { z } from "zod";
import { isPossibleNumber, parsePhoneNumberFromString } from "libphonenumber-js";

const isValidPhoneNumber = (phone?: string) => {
    if (!phone) return true;

    console.log({ phone, possible: isPossibleNumber(phone) });
    const parsedPhoneNumber = parsePhoneNumberFromString(phone);
    return isPossibleNumber(phone);
};

export const contactFormSchema = z.object({
    lastname: z
        .string({
            required_error: "Champ requis",
            invalid_type_error: "Nom / Prénom doit être une chaine de caractère",
        })
        .min(1, { message: "Champ requis" })
        .max(100),
    firstname: z
        .string({
            required_error: "Champ requis",
            invalid_type_error: "Nom / Prénom doit être une chaine de caractère",
        })
        .min(1, { message: "Champ requis" })
        .max(100),
    email: z.string({ required_error: "Champs requis" }).email().min(1, { message: "Champ requis" }),
    subject: z.string({ required_error: "Champ requis" }).min(1, { message: "Champ requis" }).max(255),
    message: z.string({ required_error: "Champ requis" }).min(1, { message: "Champ requis" }).max(5000),
});
