"use client";

import { useActionState } from "react";
import { Check, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { InquiryFeedback } from "@/lib/wedding-service/inquiry";
import { sendWeddingInquiry } from "@/app/(wedding)/mariage/actions";

import { usePlanChoice } from "./plan-choice";

const plans = [
    { value: "intime", label: "Intime" },
    { value: "essentiel", label: "Essentiel" },
    { value: "signature", label: "Signature" },
    { value: "indecis", label: "Je ne sais pas encore" },
] as const;

const guestOptions = [
    { value: "moins-60", label: "Moins de 60" },
    { value: "60-120", label: "60 à 120" },
    { value: "120-200", label: "120 à 200" },
    { value: "plus-200", label: "Plus de 200" },
] as const;

const initialFeedback: InquiryFeedback = { status: "idle" };

const fieldClass =
    "min-h-12 rounded-sm border border-wed-night-line bg-transparent px-3.5 text-base text-wed-night-text placeholder:text-wed-night-muted/70 focus:border-wed-gold-soft focus:outline-none aria-invalid:border-wed-gold-soft";

const errorOf = (feedback: InquiryFeedback, field: string) =>
    feedback.status === "invalid" ? feedback.fields[field] : undefined;

/** Restores what was typed: React empties the form after each submission. */
const valueOf = (feedback: InquiryFeedback, field: string) =>
    feedback.status === "invalid" || feedback.status === "error"
        ? feedback.values[field]
        : undefined;

type FieldProps = {
    name: string;
    label: string;
    hint?: string;
    feedback: InquiryFeedback;
    className?: string;
    children: (props: {
        id: string;
        "aria-invalid": boolean;
        "aria-describedby"?: string;
    }) => React.ReactNode;
};

const Field = ({ name, label, hint, feedback, className, children }: FieldProps) => {
    const error = errorOf(feedback, name);
    const errorId = `${name}-erreur`;
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <label htmlFor={name} className="text-sm">
                {label} {hint && <span className="text-wed-night-muted">{hint}</span>}
            </label>
            {children({
                id: name,
                "aria-invalid": Boolean(error),
                "aria-describedby": error ? errorId : undefined,
            })}
            {error && (
                <p id={errorId} className="text-wed-gold-soft text-sm">
                    {error}
                </p>
            )}
        </div>
    );
};

const SentMessage = () => (
    <div role="status" className="border-wed-night-line rounded-md border p-8">
        <Check aria-hidden="true" className="text-wed-gold-soft size-6" />
        <p className="font-wed-serif mt-4 text-3xl">Merci, c&apos;est bien reçu.</p>
        <p className="text-wed-night-muted mt-2">
            Je vous réponds sous 48 heures avec une première idée de direction et une date pour en
            parler.
        </p>
    </div>
);

export const WeddingContactForm = () => {
    const [feedback, formAction, pending] = useActionState(sendWeddingInquiry, initialFeedback);
    const [plan, setPlan] = usePlanChoice("signature");

    if (feedback.status === "sent") return <SentMessage />;

    return (
        <form action={formAction} noValidate className="grid gap-x-4 gap-y-5 md:grid-cols-2">
            <Field name="names" label="Vos prénoms" feedback={feedback}>
                {(props) => (
                    <input
                        {...props}
                        name="names"
                        defaultValue={valueOf(feedback, "names")}
                        autoComplete="name"
                        placeholder="Camille & Hugo"
                        className={fieldClass}
                    />
                )}
            </Field>
            <Field name="email" label="Email" feedback={feedback}>
                {(props) => (
                    <input
                        {...props}
                        name="email"
                        defaultValue={valueOf(feedback, "email")}
                        type="email"
                        autoComplete="email"
                        className={fieldClass}
                    />
                )}
            </Field>
            <Field
                name="weddingDate"
                label="Date du mariage"
                hint="(même approximative)"
                feedback={feedback}
            >
                {(props) => (
                    <input
                        {...props}
                        name="weddingDate"
                        defaultValue={valueOf(feedback, "weddingDate")}
                        placeholder="Juin 2027"
                        className={fieldClass}
                    />
                )}
            </Field>
            <Field name="guests" label="Nombre d'invités" feedback={feedback}>
                {(props) => (
                    <select
                        {...props}
                        name="guests"
                        defaultValue={valueOf(feedback, "guests") ?? "60-120"}
                        className={cn(fieldClass, "[&>option]:text-wed-ink")}
                    >
                        {guestOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}
            </Field>
            <fieldset className="md:col-span-2">
                <legend className="mb-2 text-sm">Formule envisagée</legend>
                <div className="flex flex-wrap gap-2">
                    {plans.map((option) => (
                        <label
                            key={option.value}
                            className="border-wed-night-line has-checked:border-wed-gold-soft has-checked:text-wed-gold-soft flex min-h-11 cursor-pointer items-center rounded-sm border px-3.5 text-sm"
                        >
                            <input
                                type="radio"
                                name="plan"
                                value={option.value}
                                checked={plan === option.value}
                                onChange={() => setPlan(option.value)}
                                className="sr-only"
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            </fieldset>
            <Field
                name="message"
                label="Votre mariage en quelques mots"
                feedback={feedback}
                className="md:col-span-2"
            >
                {(props) => (
                    <textarea
                        {...props}
                        name="message"
                        defaultValue={valueOf(feedback, "message")}
                        rows={4}
                        placeholder="Le lieu, l'ambiance, ce qui compte pour vous…"
                        className={cn(fieldClass, "py-3")}
                    />
                )}
            </Field>
            <div className="md:col-span-2">
                <label className="text-wed-night-muted flex cursor-pointer items-start gap-3 py-1.5 text-sm">
                    <input
                        type="checkbox"
                        name="consent"
                        defaultChecked={valueOf(feedback, "consent") === "on"}
                        aria-invalid={Boolean(errorOf(feedback, "consent"))}
                        aria-describedby={
                            errorOf(feedback, "consent") ? "consent-erreur" : undefined
                        }
                        className="accent-wed-gold-soft mt-0.5 size-5 shrink-0"
                    />
                    J&apos;accepte que ces informations servent à me recontacter. Elles ne sont
                    jamais partagées.
                </label>
                {errorOf(feedback, "consent") && (
                    <p id="consent-erreur" className="text-wed-gold-soft mt-1 text-sm">
                        {errorOf(feedback, "consent")}
                    </p>
                )}
            </div>
            {feedback.status === "error" && (
                <p
                    role="alert"
                    className="border-wed-gold-soft/40 rounded-sm border p-3.5 text-sm md:col-span-2"
                >
                    {feedback.message}
                </p>
            )}
            <button
                type="submit"
                disabled={pending}
                className="bg-wed-ivory text-wed-ink hover:bg-wed-paper inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-6 font-medium transition-colors disabled:opacity-60 md:col-span-2"
            >
                {pending && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
                {pending ? "Envoi en cours…" : "Envoyer ma demande"}
            </button>
        </form>
    );
};
