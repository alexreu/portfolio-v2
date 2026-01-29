import { NextRequest, NextResponse } from "next/server";

import { postmarkClient } from "@/lib/postmark";
import { contactFormSchema } from "@/lib/schemas/contact-form-schema";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = contactFormSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "Validation failed", details: result.error.flatten() },
                { status: 400 },
            );
        }

        const { firstname, lastname, email, subject, message } = result.data;

        await postmarkClient.sendEmail({
            From: "contact@alexdevlab.com",
            To: "contact@alexdevlab.com",
            Subject: subject,
            TextBody: `${firstname} ${lastname}\nContact information: ${email}\n ${message}`,
            MessageStream: "portfolio-contact-form",
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Email sending failed:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}
