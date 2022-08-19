import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import { SocialLink } from "../SocialLink";
import { id } from "../../modules/idGenerator";
import Link from "next/link";

const socialLinks = [
    {
        id: id(),
        title: "alexandre.adolphepro@gmail.com",
        url: "mailto:alexandre.adolphepro@gmail.com",
        icon: "envelope",
    },
    {
        id: id(),
        title: "06.92.15.06.79",
        url: "tel:+262692150679",
        icon: "phone",
    },
    {
        id: id(),
        title: "Linkedin",
        url: "#",
        icon: "linkedin",
    },
];
export const Footer = () => {
    return (
        <footer className={styles.footer} id="contact">
            <div className="container">
                <div className="lg:grid grid-cols-2 gap-10">
                    <div className={styles.footerPictureWrapper}>
                        <Image src="/images/contact-us.jpg" alt="" layout="fill" className={styles.footerPicture} />
                        <div className={styles.footerPictureContent}>
                            Restons en <span className="font-semibold">contact !</span>
                        </div>
                    </div>
                    <ul className={styles.footerSocialList}>
                        {socialLinks.map(link => {
                            const { id, title, icon, url } = link;
                            return (
                                <li key={id}>
                                    <SocialLink icon={icon} title={title} url={url} />
                                </li>
                            );
                        })}
                        <li className="flex">
                            <div className="inline-flex items-center text-sm lg:text-base text-white font-light">
                                <i className="bi bi-shield-check inline-flex items-center mr-4 lg:mr-8 text-xl"></i>
                                <Link href="/legal-mentions">
                                    <a className="transform transition-all ease-in duration-200 hover:-translate-y-[3px] hover:text-primary">
                                        Mentions Légales
                                    </a>
                                </Link>
                                <span className="mx-1">,</span>
                                <Link href="/confidentiality-policy">
                                    <a className="transform transition-all ease-in duration-200 hover:-translate-y-[3px] hover:text-primary">
                                        Politique de confidentialités
                                    </a>
                                </Link>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="mt-8 py-4 text-center border-t border-lighter font-light text-primary-light">
                    <p>Copyright Alex DevLab 2022 - Tous droits reservés</p>
                </div>
            </div>
        </footer>
    );
};
