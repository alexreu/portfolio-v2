import { postmarkClient } from "@/lib/postmark";
import { contactFormSchema } from "@/lib/schemas/contact-form-schema";
import { z } from "zod";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const res: z.infer<typeof contactFormSchema> = await request.json();
    const { firstname, lastname, email, subject, message } = res;

    await postmarkClient.sendEmail({
        From: "contact@alexdevlab.com",
        To: "contact@alexdevlab.com",
        Subject: subject,
        TextBody: `${firstname} ${lastname}\nContact information: ${email}\n ${message}`,
        MessageStream: "portfolio-contact-form",
    });
}
