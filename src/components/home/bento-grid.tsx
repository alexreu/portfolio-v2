"use client";

import { motion } from "motion/react";

import { ContactCard } from "./contact-card";
import { PricingCard } from "./pricing-card";
import { ServicesCard } from "./services-card";
import { SkillsCard } from "./skill-cards";

export const BentoGrid = () => {
    return (
        <section className="pb-20">
            <div className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Row 1: Small cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {/*<SocialCard />*/}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="md:col-span-2"
                >
                    {/*<NavigationCard title="À propos" icon="info" href="#a-propos" />*/}
                </motion.div>

                {/* Row 2: Big Services Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:col-span-2 lg:col-span-3 lg:row-span-2"
                >
                    <ServicesCard />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="lg:row-span-2"
                >
                    {/*<ExperienceCard />*/}
                </motion.div>

                {/* Row 3: Skills */}
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
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="md:col-span-2 lg:col-span-3"
                >
                    <PricingCard />
                </motion.div>

                {/* Row 5: Big Contact CTA - Full Width */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="md:col-span-2 lg:col-span-3"
                >
                    <ContactCard />
                </motion.div>
            </div>
        </section>
    );
};
