"use client";

import React from "react";
import styles from "./HomeSection.module.css";
import { Heading } from "../../Heading";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const HomeSection = () => {
    return (
        <section id="home" className={styles.homeBackground}>
            <div className="container relative z-10">
                <span className="font-sub text-gray-light mb-2 inline-flex w-full text-base uppercase tracking-[4px] opacity-70 lg:mb-5">
                    Freelance
                </span>
                <Heading
                    variant="h1"
                    className="font-montserrat text-white-base inline-flex flex-col items-center gap-5 text-3xl font-black lg:text-6xl"
                >
                    <span className="w-full">Alex DevLab</span>
                    <span className="text-primary-base w-full">Developpeur JS.</span>
                </Heading>
                <p className="font-main text-white-base mb-7 mt-5 text-base leading-none lg:text-[54px]">
                    basé à la Réunion.
                </p>
                <Link
                    href="/#"
                    className={buttonVariants({ variant: "outline", className: "text-white-base text-3xl" })}
                >
                    Voir mon cv
                </Link>
            </div>
        </section>
    );
};
