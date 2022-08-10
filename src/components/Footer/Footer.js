import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import { SocialIcon } from "../SocialIcon";

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className=" grid grid-cols-3">
                    <div className="col-span-1">
                        <Image src="/vercel.svg" alt="" height={60} width={130} className={styles.footerLogo} />
                    </div>
                    <div className={styles.footerSocialWrapper}>
                        <ul className={styles.footerSocialList}>
                            <li>
                                <SocialIcon icon="facebook" title="Voir la page facebook" isBlank={false} url={"#"} />
                            </li>
                            <li>
                                <SocialIcon icon="facebook" title="Voir la page facebook" isBlank={false} url={"#"} />
                            </li>
                            <li>
                                <SocialIcon icon="facebook" title="Voir la page facebook" isBlank={false} url={"#"} />
                            </li>
                            <li>
                                <SocialIcon icon="facebook" title="Voir la page facebook" isBlank={false} url={"#"} />
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-1"></div>
                </div>
            </div>
        </footer>
    );
};
