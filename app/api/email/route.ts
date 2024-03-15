import { postmarkClient } from "@/lib/postmark";
import { NextRequest } from "next/server";
import { EmailResource } from "@/lib/queries/email/email-resource";

export async function POST(request: NextRequest) {
    const res: EmailResource = await request.json();
    const { firstname, lastname, email, subject, message } = res;

    await postmarkClient.sendEmail({
        From: "contact@alexdevlab.com",
        To: "contact@alexdevlab.com",
        Subject: subject,
        TextBody: `${firstname} ${lastname}\nContact information: ${email}\n ${message}`,
        MessageStream: "portfolio-contact-form",
    });
}
