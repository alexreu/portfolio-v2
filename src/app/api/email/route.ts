import { NextRequest, NextResponse } from "next/server";

import { postmarkClient } from "@/lib/postmark";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { contactFormSchema } from "@/lib/schemas/contact-form-schema";

// Rate limit: 5 requests per 60 seconds per IP
const RATE_LIMIT_CONFIG = {
    limit: 5,
    windowInSeconds: 60,
};

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const clientIp = getClientIp(request);
        const rateLimitResult = rateLimit(clientIp, RATE_LIMIT_CONFIG);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    error: "Too many requests",
                    retryAfter: rateLimitResult.resetIn,
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": rateLimitResult.resetIn.toString(),
                        "X-RateLimit-Remaining": "0",
                    },
                },
            );
        }

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
            Subject: `[Portfolio] ${subject}`,
            TextBody: `Nouveau message de ${firstname} ${lastname}\n\nEmail: ${email}\n\nMessage:\n${message}`,
            ReplyTo: email,
            MessageStream: "portfolio-contact-form",
        });

        return NextResponse.json(
            { success: true },
            {
                status: 200,
                headers: {
                    "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
                },
            },
        );
    } catch (error) {
        // Sanitize error for logging - don't expose sensitive details
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

        // In production, send to monitoring service (Sentry, etc.)
        // Only log sanitized message, not the full error object
        if (process.env.NODE_ENV === "development") {
            console.error("Email sending failed:", errorMessage);
        }

        return NextResponse.json(
            { error: "Failed to send email. Please try again later." },
            { status: 500 },
        );
    }
}
