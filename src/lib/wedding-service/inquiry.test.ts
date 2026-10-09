import { describe, expect, it, vi } from "vitest";

import { inquiryFeedback, submitInquiry, type InquiryEmail } from "./inquiry";

const validForm = {
    names: "Camille & Hugo",
    email: "camille@example.com",
    weddingDate: "Juin 2027",
    guests: "60-120",
    plan: "signature",
    message: "Mariage au Domaine des Oliviers.",
    consent: "on",
};

/** Stands in for Resend, the external email service. */
const fakeSender = () => vi.fn(async (_email: InquiryEmail) => ({ ok: true as const }));

const alwaysAllowed = () => true;

describe("submitInquiry", () => {
    it("sends one summary email to AlexDevLab, replying to the couple", async () => {
        const send = fakeSender();

        const result = await submitInquiry({ send, isAllowed: alwaysAllowed })(validForm);

        expect(result.ok).toBe(true);
        expect(send).toHaveBeenCalledTimes(1);
        const [email] = send.mock.calls[0];
        expect(email).toMatchObject({
            replyTo: "camille@example.com",
            subject: "Site de mariage · Camille & Hugo · Juin 2027",
        });
        expect(email.text).toContain("Invités : 60 à 120");
        expect(email.text).toContain("Formule : Signature");
    });

    it("returns an error per invalid field and sends nothing", async () => {
        const send = fakeSender();
        const { consent: _consent, ...withoutConsent } = validForm;

        const result = await submitInquiry({ send, isAllowed: alwaysAllowed })({
            ...withoutConsent,
            names: " ",
            email: "camille",
        });

        expect(result).toEqual({
            ok: false,
            error: {
                kind: "invalid",
                fields: {
                    names: "Indiquez vos prénoms.",
                    email: "Cette adresse email n'est pas valide.",
                    consent: "Merci d'accepter d'être recontactés.",
                },
            },
        });
        expect(send).not.toHaveBeenCalled();
    });

    it("refuses the request once the sender has reached the rate limit", async () => {
        const send = fakeSender();

        const result = await submitInquiry({ send, isAllowed: () => false })(validForm);

        expect(result).toEqual({ ok: false, error: { kind: "rate-limited" } });
        expect(send).not.toHaveBeenCalled();
    });

    it("reports a failed delivery instead of claiming success", async () => {
        const send = vi.fn(async (_email: InquiryEmail) => ({ ok: false as const }));

        const result = await submitInquiry({ send, isAllowed: alwaysAllowed })(validForm);

        expect(result).toEqual({ ok: false, error: { kind: "send-failed" } });
    });
});

describe("inquiryFeedback", () => {
    const typed = { names: "Camille & Hugo", message: "Domaine des Oliviers" };

    it("thanks the couple once the request is sent", () => {
        expect(inquiryFeedback({ ok: true, value: null }, typed)).toEqual({ status: "sent" });
    });

    it("keeps field errors next to their fields, and what the couple typed", () => {
        expect(
            inquiryFeedback(
                { ok: false, error: { kind: "invalid", fields: { email: "Email ?" } } },
                typed,
            ),
        ).toEqual({ status: "invalid", fields: { email: "Email ?" }, values: typed });
    });

    it("offers the direct email address when the request could not go through", () => {
        expect(inquiryFeedback({ ok: false, error: { kind: "send-failed" } }, typed)).toEqual({
            status: "error",
            message: "L'envoi n'a pas abouti. Écrivez-moi directement à contact@alexdevlab.com.",
            values: typed,
        });
        expect(inquiryFeedback({ ok: false, error: { kind: "rate-limited" } }, typed)).toEqual({
            status: "error",
            message:
                "Plusieurs demandes viennent d'être envoyées. Réessayez dans une heure ou écrivez-moi à contact@alexdevlab.com.",
            values: typed,
        });
    });
});
