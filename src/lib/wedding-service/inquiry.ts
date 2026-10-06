import { z } from "zod";

import { site } from "@/lib/seo";
import { failure, success, type Result } from "@/lib/wedding/result";

const guestLabels = {
    "moins-60": "moins de 60",
    "60-120": "60 à 120",
    "120-200": "120 à 200",
    "plus-200": "plus de 200",
} as const;

const planLabels = {
    intime: "Intime",
    essentiel: "Essentiel",
    signature: "Signature",
    indecis: "Je ne sais pas encore",
} as const;

const inquirySchema = z.object({
    names: z
        .string({ error: "Indiquez vos prénoms." })
        .trim()
        .min(1, { error: "Indiquez vos prénoms." }),
    email: z.email({ error: "Cette adresse email n'est pas valide." }),
    weddingDate: z
        .string({ error: "Indiquez la date, même approximative." })
        .trim()
        .min(1, { error: "Indiquez la date, même approximative." }),
    guests: z.enum(Object.keys(guestLabels) as [keyof typeof guestLabels], {
        error: "Choisissez un nombre d'invités.",
    }),
    plan: z.enum(Object.keys(planLabels) as [keyof typeof planLabels], {
        error: "Choisissez une formule.",
    }),
    message: z.string().trim().max(2000, { error: "2 000 caractères maximum." }).default(""),
    consent: z.literal("on", { error: "Merci d'accepter d'être recontactés." }),
});

export type Inquiry = z.infer<typeof inquirySchema>;

export type InquiryEmail = {
    readonly subject: string;
    readonly text: string;
    readonly replyTo: string;
};

export type InquiryError =
    | {
          readonly kind: "invalid";
          /** First message for each invalid field, keyed by field name. */
          readonly fields: Readonly<Record<string, string>>;
      }
    | { readonly kind: "rate-limited" }
    | { readonly kind: "send-failed" };

export type InquiryDeps = {
    readonly send: (email: InquiryEmail) => Promise<{ readonly ok: boolean }>;
    /** Rate limit for the sender of this request. */
    readonly isAllowed: () => boolean;
};

export const inquiryEmail = (inquiry: Inquiry): InquiryEmail => ({
    subject: `Site de mariage · ${inquiry.names} · ${inquiry.weddingDate}`,
    replyTo: inquiry.email,
    text: [
        `Prénoms : ${inquiry.names}`,
        `Email : ${inquiry.email}`,
        `Date du mariage : ${inquiry.weddingDate}`,
        `Invités : ${guestLabels[inquiry.guests]}`,
        `Formule : ${planLabels[inquiry.plan]}`,
        "",
        inquiry.message,
    ].join("\n"),
});

const fieldErrors = (error: z.ZodError<z.input<typeof inquirySchema>>): Record<string, string> =>
    Object.fromEntries(
        Object.entries(z.flattenError(error).fieldErrors).flatMap(([field, messages]) =>
            messages?.[0] ? [[field, messages[0]]] : [],
        ),
    );

export const submitInquiry =
    (deps: InquiryDeps) =>
    async (form: Readonly<Record<string, unknown>>): Promise<Result<null, InquiryError>> => {
        const parsed = inquirySchema.safeParse(form);
        if (!parsed.success) return failure({ kind: "invalid", fields: fieldErrors(parsed.error) });
        if (!deps.isAllowed()) return failure({ kind: "rate-limited" });

        const delivery = await deps.send(inquiryEmail(parsed.data));
        return delivery.ok ? success(null) : failure({ kind: "send-failed" });
    };

export type InquiryFeedback =
    | { readonly status: "idle" }
    | { readonly status: "sent" }
    | {
          readonly status: "invalid";
          readonly fields: Readonly<Record<string, string>>;
          readonly values: SubmittedValues;
      }
    | { readonly status: "error"; readonly message: string; readonly values: SubmittedValues };

/** What the couple typed: React empties the form after each submission, so it is sent back. */
export type SubmittedValues = Readonly<Record<string, string>>;

const errorMessages: Record<"rate-limited" | "send-failed", string> = {
    "rate-limited": `Plusieurs demandes viennent d'être envoyées. Réessayez dans une heure ou écrivez-moi à ${site.email}.`,
    "send-failed": `L'envoi n'a pas abouti. Écrivez-moi directement à ${site.email}.`,
};

/** What the form shows after a submission. */
export const inquiryFeedback = (
    result: Result<null, InquiryError>,
    values: SubmittedValues,
): InquiryFeedback =>
    result.ok
        ? { status: "sent" }
        : result.error.kind === "invalid"
          ? { status: "invalid", fields: result.error.fields, values }
          : { status: "error", message: errorMessages[result.error.kind], values };
