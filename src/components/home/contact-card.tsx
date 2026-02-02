import { ArrowRight, Calendar, Mail, MessageSquare } from "lucide-react";

export const ContactCard = () => {
    return (
        <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF4D4D] via-[#ff5757] to-[#ff6b6b] p-[2px]">
            {/* Animated gradient border */}
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#FF4D4D] via-purple-500 to-[#FF4D4D] opacity-50" />

            <div className="relative h-full rounded-3xl bg-[#0a0a0a] p-8 md:p-12">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#FF4D4D]/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
                </div>

                <div className="relative z-10 grid h-full items-center gap-8 md:grid-cols-2">
                    {/* Left: Main CTA */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF4D4D]/30 bg-[#FF4D4D]/20 px-4 py-2">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-[#FF4D4D]" />
                                <span className="text-sm font-semibold text-[#FF4D4D]">
                                    Réponse garantie sous 24h
                                </span>
                            </div>

                            <h2 className="text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
                                Prêt à booster
                                <br />
                                <span className="text-[#FF4D4D]">votre présence web ?</span>
                            </h2>

                            <p className="text-lg leading-relaxed text-gray-400">
                                Devis gratuit • Pas d'engagement • Premier échange offert pour
                                définir ensemble votre projet.
                            </p>
                        </div>

                        {/* Main CTA Button */}
                        <button className="group relative overflow-hidden rounded-full bg-[#FF4D4D] px-10 py-5 text-lg font-bold text-white shadow-[0_0_40px_rgba(255,77,77,0.5)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_60px_rgba(255,77,77,0.7)]">
                            <span className="relative z-10 flex items-center gap-3">
                                Démarrer mon projet
                                <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b6b] to-[#FF4D4D] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </button>

                        {/* Trust indicators */}
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
                                    <Mail className="h-4 w-4 text-[#FF4D4D]" />
                                </div>
                                <span>Réponse sous 24h</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
                                    <Calendar className="h-4 w-4 text-[#FF4D4D]" />
                                </div>
                                <span>Devis gratuit</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>Sans engagement</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Methods */}
                    <div className="space-y-4">
                        <h3 className="mb-6 text-xl font-semibold text-gray-300">
                            Ou contactez-moi directement
                        </h3>

                        <a
                            href="mailto:contact@alexdevlab.com"
                            className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:translate-x-1 hover:border-[#FF4D4D]/30 hover:bg-white/[0.06]"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#FF4D4D]/20 bg-[#FF4D4D]/10 transition-all duration-300 group-hover:bg-[#FF4D4D]/20">
                                <Mail className="h-6 w-6 text-[#FF4D4D]" />
                            </div>
                            <div className="flex-1">
                                <div className="mb-1 text-sm text-gray-400">
                                    Email professionnel
                                </div>
                                <div className="font-semibold transition-colors duration-300 group-hover:text-[#FF4D4D]">
                                    contact@alexdevlab.com
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#FF4D4D]" />
                        </a>

                        <a
                            href="#calendly"
                            className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:translate-x-1 hover:border-[#FF4D4D]/30 hover:bg-white/[0.06]"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 transition-all duration-300 group-hover:bg-purple-500/20">
                                <Calendar className="h-6 w-6 text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <div className="mb-1 text-sm text-gray-400">Rendez-vous offert</div>
                                <div className="font-semibold transition-colors duration-300 group-hover:text-purple-400">
                                    Réserver un appel (30 min gratuit)
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-purple-400" />
                        </a>

                        <a
                            href="#whatsapp"
                            className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:translate-x-1 hover:border-[#FF4D4D]/30 hover:bg-white/[0.06]"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10 transition-all duration-300 group-hover:bg-green-500/20">
                                <MessageSquare className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="flex-1">
                                <div className="mb-1 text-sm text-gray-400">WhatsApp Business</div>
                                <div className="font-semibold transition-colors duration-300 group-hover:text-green-400">
                                    Message instantané (Réponse rapide)
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-green-400" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
