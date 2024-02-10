"use client";

import React from "react";
import styles from "./HomeSection.module.css";
import { Heading } from "../../Heading";
import Link from "next/link";

export const HomeSection = () => {
    return (
        <section id="home" className={styles.homeBackground}>
            <div className="container relative z-10">
                <span className="mb-2 inline-flex w-full font-sub text-base uppercase tracking-[4px] text-grey-light opacity-70 lg:mb-5">
                    Freelance
                </span>
                <Heading
                    variant="h1"
                    className="inline-flex flex-col items-center gap-5 font-montserrat text-3xl font-black text-white lg:text-6xl"
                >
                    <span className="w-full">Alex DevLab</span>
                    <span className="w-full text-primary">Developpeur JS.</span>
                </Heading>
                <p className="mb-7 mt-5 font-main text-base leading-none text-white lg:text-[54px]">
                    basé à la Réunion.
                </p>
                <Link href="/resume" className="btn btn-default border-grey-light text-white lgd:hidden">
                    Voir mon cv
                </Link>
            </div>
        </section>
    );
};
