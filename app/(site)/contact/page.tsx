import { Metadata } from "next";
import { ContactPageContent } from "@/components/contact-page/contact-page-content";

export const metadata: Metadata = {
    title: "Contact | AlexDevLab",
    description: "Contactez AlexDevLab, développeur front freelance à l'île de la Réunion.",
};

export default function ContactPage() {
    return <ContactPageContent />;
}
