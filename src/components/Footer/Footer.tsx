import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import { SocialLink } from "../SocialLink";
import contactUs from "../../../public/images/contact-us.jpg";
import { SendHorizontal, CircleUser, Linkedin } from "lucide-react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-black py-8 font-main" id="contact">
            <div className="container">
                <div className="grid-cols-2 gap-10 lg:grid">
                    <div className={styles.footerPictureWrapper}>
                        <Image
                            src={contactUs}
                            alt=""
                            className="absolute bottom-0 left-0 h-full w-full object-cover object-center"
                            priority={true}
                            width={549}
                            height={350}
                        />
                        <div className="relative z-10 w-full text-2xl text-white text-opacity-75 lg:text-4xl">
                            Restons en <span className="font-semibold">contact !</span>
                        </div>
                    </div>
                    <ul className="col-span-1 flex flex-col justify-center gap-8">
                        <li>
                            <SocialLink
                                icon={<SendHorizontal />}
                                title="alexandre.adolphepro@gmail.com"
                                url="mailto:alexandre.adolphepro@gmail.com"
                                isPage={false}
                            />
                        </li>
                        <li>
                            <SocialLink
                                icon={<Linkedin />}
                                title="Linkedin"
                                url="https://www.linkedin.com/in/alexandre-adolphe-817059146/"
                                isPage={false}
                            />
                        </li>
                        <li>
                            <SocialLink
                                icon={<CircleUser />}
                                title="Profil freelance malt"
                                url="https://www.malt.fr/profile/alexandreadolphe"
                                isPage={false}
                            />
                        </li>
                    </ul>
                </div>
                <div className="mt-8 border-t border-lighter py-4 text-center font-light text-primary-light">
                    <p className="flex items-center justify-center gap-2 lgd:flex-col landscape:flex-row">
                        <span>© Copyright AlexDevLab {currentYear}</span>
                        <span className="lgd:hidden">-</span>
                        <span>
                            Créer et conçu par <strong>AlexDevLab</strong>. Tous droits reservés.
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
};
