"use client";

import { motion } from "motion/react";

import { AboutCard } from "./about-card";
import { ContactCard } from "./contact-card";
import { PricingCard } from "./pricing-card";
import { ServicesCard } from "./services-card";
import { SkillsCard } from "./skill-cards";

export const BentoGrid = () => {
    return (
        <section className="pb-20">
            <div className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* About Section */}
                <motion.div
                    id="a-propos"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="md:col-span-3 scroll-mt-24"
                >
                    <AboutCard />
                </motion.div>

                {/* Services Section */}
                <motion.div
                    id="services"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="md:col-span-2 lg:col-span-3 scroll-mt-24"
                >
                    <ServicesCard />
                </motion.div>

                {/* Skills Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="md:col-span-2 lg:col-span-3"
                >
                    <SkillsCard />
                </motion.div>

                {/* Row 4: Pricing Section - Full Width */}
                <motion.div
                    id="tarifs"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="md:col-span-2 lg:col-span-3 scroll-mt-24"
                >
                    <PricingCard />
                </motion.div>

                {/* Row 5: Big Contact CTA - Full Width */}
                <motion.div
                    id="contact"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="md:col-span-2 lg:col-span-3 scroll-mt-24"
                >
                    <ContactCard />
                </motion.div>
            </div>
        </section>
    );
};
