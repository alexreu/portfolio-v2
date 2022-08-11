import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import { SocialLink } from "../SocialLink";
import { id } from "../../modules/idGenerator";

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
        <footer className={styles.footer} id="#footer">
            <div className="container">
                <div className=" grid grid-cols-2 gap-10">
                    <div className={styles.footerPictureWrapper}>
                        <Image src="/images/contact-us.jpeg" alt="" layout="fill" className={styles.footerPicture} />
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
                    </ul>
                </div>
            </div>
        </footer>
    );
};
