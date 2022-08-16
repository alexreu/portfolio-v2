import React from "react";
import styles from "./HomeSection.module.css";
import { Heading } from "../../Heading";
import Link from "next/link";

export const HomeSection = () => {
    return (
        <section id="home" className={styles.homeBackground}>
            <div className="container relative z-10">
                <span className="inline-flex w-full mb-5 font-sub text-grey-light text-base uppercase opacity-70 tracking-[4px]">
                    Developpeur Front end
                </span>
                <Heading
                    variant="h1"
                    className="flex items-center flex-col text-white text-[30px] lg:text-[58px] lg:leading-[75px] font-montserrat font-black"
                >
                    <span className="w-full">Alexandre Adolphe</span>
                    <span className="w-full text-primary">Developpeur JS.</span>
                </Heading>
                <p className="mt-5 mb-7 text-base lg:text-[54px] text-white font-main leading-none">
                    basé à la Réunion.
                </p>
                <Link href="/resume">
                    <a className="btn btn-default text-white border-grey-light">Voir mon cv</a>
                </Link>
            </div>
        </section>
    );
};
