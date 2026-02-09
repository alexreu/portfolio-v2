"use client";

import { motion } from "motion/react";

import type { PricingPlan, Service, SiteSettings, SkillCategory } from "@/lib/sanity/types";

import { AboutCard } from "./about-card";
import { ContactCard } from "./contact-card";
import { PricingCard } from "./pricing-card";
import { ServicesCard } from "./services-card";
import { SkillsCard } from "./skill-cards";

type BentoGridProps = {
    aboutData?: SiteSettings["about"] | null;
    contactData?: SiteSettings["contact"] | null;
    services?: Service[];
    pricingPlans?: PricingPlan[];
    skillCategories?: SkillCategory[];
};

export const BentoGrid = ({
    aboutData,
    contactData,
    services,
    pricingPlans,
    skillCategories,
}: BentoGridProps) => {
    return (
        <section className="pb-10 xl:pb-20">
            <div className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* About Section */}
                <motion.div
                    id="a-propos"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="scroll-mt-24 md:col-span-2 lg:col-span-3"
                >
                    <AboutCard data={aboutData} />
                </motion.div>

                {/* Services Section */}
                <motion.div
                    id="services"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="scroll-mt-24 md:col-span-2 lg:col-span-3"
                >
                    <ServicesCard services={services} />
                </motion.div>

                {/* Skills Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="md:col-span-2 lg:col-span-3"
                >
                    <SkillsCard categories={skillCategories} />
                </motion.div>

                {/* Pricing Section */}
                <motion.div
                    id="tarifs"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="scroll-mt-24 md:col-span-2 lg:col-span-3"
                >
                    <PricingCard plans={pricingPlans} />
                </motion.div>

                {/* Contact Section */}
                <motion.div
                    id="contact"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="scroll-mt-24 md:col-span-2 lg:col-span-3"
                >
                    <ContactCard data={contactData} />
                </motion.div>
            </div>
        </section>
    );
};
