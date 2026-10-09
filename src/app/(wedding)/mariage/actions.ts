"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import { rateLimit } from "@/lib/rate-limit";
import {
    inquiryFeedback,
    submitInquiry,
    type InquiryEmail,
    type InquiryFeedback,
} from "@/lib/wedding-service/inquiry";

/** Three requests per hour and per IP: enough for a couple, too few for a bot. */
const RATE_LIMIT = { limit: 3, windowInSeconds: 3600 };

const sendWithResend = async (email: InquiryEmail) => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.WEDDING_INQUIRY_FROM;
    const to = process.env.WEDDING_INQUIRY_TO;
    if (!apiKey || !from || !to) return { ok: false };

    const { error } = await new Resend(apiKey).emails.send({ from, to, ...email });
    return { ok: !error };
};

const clientIp = async () =>
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

const textEntries = (formData: FormData): Record<string, string> =>
    Object.fromEntries(
        [...formData.entries()].flatMap(([key, value]) =>
            typeof value === "string" ? [[key, value]] : [],
        ),
    );

export const sendWeddingInquiry = async (
    _previous: InquiryFeedback,
    formData: FormData,
): Promise<InquiryFeedback> => {
    const ip = await clientIp();
    const submitted = textEntries(formData);
    const result = await submitInquiry({
        send: sendWithResend,
        isAllowed: () => rateLimit(`wedding-inquiry:${ip}`, RATE_LIMIT).success,
    })(submitted);

    return inquiryFeedback(result, submitted);
};
