import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import { SocialLink } from "../SocialLink";
import { id } from "../../modules/idGenerator";
import contactUs from "../../../public/images/contact-us.jpg";

const socialLinks = [
    {
        id: id(),
        title: "alexandre.adolphepro@gmail.com",
        url: "mailto:alexandre.adolphepro@gmail.com",
        icon: "envelope",
    },
    {
        id: id(),
        title: "Linkedin",
        url: "https://www.linkedin.com/in/alexandre-adolphe-817059146/",
        icon: "linkedin",
    },
    {
        id: id(),
        title: "Profil freelance malt",
        url: "https://www.malt.fr/profile/alexandreadolphe",
        icon: "person-workspace",
    },
];
export const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className={styles.footer} id="contact">
            <div className="container">
                <div className="lg:grid grid-cols-2 gap-10">
                    <div className={styles.footerPictureWrapper}>
                        <Image
                            src={contactUs}
                            alt=""
                            className={styles.footerPicture}
                            priority={true}
                            width={549}
                            height={350}
                        />
                        <div className={styles.footerPictureContent}>
                            Restons en <span className="font-semibold">contact !</span>
                        </div>
                    </div>
                    <ul className={styles.footerSocialList}>
                        {socialLinks.map(link => {
                            const { id, title, icon, url, isPage } = link;
                            return (
                                <li key={id}>
                                    <SocialLink icon={icon} title={title} url={url} isPage={isPage} />
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="mt-8 py-4 text-center border-t border-lighter font-light text-primary-light">
                    <p className="flex items-center justify-center landscape:flex-row lgd:flex-col gap-2">
                        <span>© Copyright AlexDevLab {currentYear}</span>
                        <span className="lgd:hidden">-</span>
                        <span>
                            Créer et conçu par <strong>AlexDevLab</strong>. Tous droits reservés
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
};
