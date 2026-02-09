import { ArrowRight, Calendar, Mail, MessageSquare } from "lucide-react";

import type { SiteSettings } from "@/lib/sanity/types";
import { Button } from "@/components/ui/button";

type ContactCardProps = {
    data?: SiteSettings["contact"] | null;
};

// Default values when Sanity data is not available
const defaultData = {
    email: "contact@alexdevlab.com",
    responseTime: "Réponse garantie sous 24h",
    calendlyUrl: "#calendly",
    whatsappUrl: "#whatsapp",
};

export const ContactCard = ({ data }: ContactCardProps) => {
    const contact = { ...defaultData, ...data };

    return (
        <div className="from-primary via-primary to-primary-light relative h-full overflow-hidden rounded-3xl bg-linear-to-br p-0.5">
            {/* Animated gradient border */}
            <div className="from-primary to-primary absolute inset-0 animate-pulse bg-linear-to-r via-purple-500 opacity-50" />

            <div className="bg-background relative h-full rounded-3xl p-5 sm:p-8 md:p-12">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div className="bg-primary/10 absolute top-0 right-0 h-96 w-96 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
                </div>

                <div className="relative z-10 grid h-full items-center gap-8 lg:grid-cols-2">
                    {/* Left: Main CTA */}
                    <div className="min-w-0 space-y-6">
                        <div className="space-y-3">
                            {contact.responseTime && (
                                <div className="border-primary/30 bg-primary/20 inline-flex items-center gap-2 rounded-full border px-4 py-2">
                                    <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
                                    <span className="text-primary text-sm font-semibold">
                                        {contact.responseTime}
                                    </span>
                                </div>
                            )}

                            <h2 className="text-4xl leading-tight font-bold md:text-5xl xl:text-6xl">
                                Prêt à booster
                                <br />
                                <span className="text-primary">votre présence web ?</span>
                            </h2>

                            <p className="text-lg leading-relaxed text-gray-300">
                                Devis gratuit • Pas d&apos;engagement • Premier échange offert pour
                                définir ensemble votre projet.
                            </p>
                        </div>

                        {/* Main CTA Button */}
                        <Button variant="primary" size="lg" asChild>
                            <a href={`mailto:${contact.email}`}>
                                Démarrer mon projet
                                <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
                            </a>
                        </Button>

                        {/* Trust indicators */}
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
                                    <Mail className="text-primary h-4 w-4" />
                                </div>
                                <span>Réponse sous 24h</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
                                    <Calendar className="text-primary h-4 w-4" />
                                </div>
                                <span>Devis gratuit</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>Sans engagement</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Methods */}
                    <div className="min-w-0 space-y-4">
                        <h3 className="mb-6 text-xl font-semibold text-gray-300">
                            Ou contactez-moi directement
                        </h3>

                        {contact.email && (
                            <a
                                href={`mailto:${contact.email}`}
                                className="group hover:border-primary/30 flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:translate-x-1 hover:bg-white/[0.06]"
                            >
                                <div className="border-primary/20 bg-primary/10 group-hover:bg-primary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-300">
                                    <Mail className="text-primary h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 text-sm text-gray-300">
                                        Email professionnel
                                    </div>
                                    <div className="group-hover:text-primary truncate font-semibold transition-colors duration-300">
                                        {contact.email}
                                    </div>
                                </div>
                                <ArrowRight className="group-hover:text-primary h-5 w-5 shrink-0 text-gray-400 transition-all duration-300 group-hover:translate-x-1" />
                            </a>
                        )}

                        {contact.calendlyUrl && (
                            <a
                                href={contact.calendlyUrl}
                                target={
                                    contact.calendlyUrl.startsWith("http") ? "_blank" : undefined
                                }
                                rel={
                                    contact.calendlyUrl.startsWith("http")
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                                className="group hover:border-primary/30 flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:translate-x-1 hover:bg-white/[0.06]"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 transition-all duration-300 group-hover:bg-purple-500/20">
                                    <Calendar className="h-6 w-6 text-purple-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 text-sm text-gray-300">
                                        Rendez-vous offert
                                    </div>
                                    <div className="font-semibold transition-colors duration-300 group-hover:text-purple-400">
                                        Réserver un appel (30 min gratuit)
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 shrink-0 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-purple-400" />
                            </a>
                        )}

                        {contact.whatsappUrl && (
                            <a
                                href={contact.whatsappUrl}
                                target={
                                    contact.whatsappUrl.startsWith("http") ? "_blank" : undefined
                                }
                                rel={
                                    contact.whatsappUrl.startsWith("http")
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                                className="group hover:border-primary/30 flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:translate-x-1 hover:bg-white/[0.06]"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10 transition-all duration-300 group-hover:bg-green-500/20">
                                    <MessageSquare className="h-6 w-6 text-green-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 text-sm text-gray-300">
                                        WhatsApp Business
                                    </div>
                                    <div className="font-semibold transition-colors duration-300 group-hover:text-green-400">
                                        Message instantané (Réponse rapide)
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 shrink-0 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-green-400" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
