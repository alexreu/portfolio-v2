import React from "react";
import styles from "./Resume.module.css";
import { Heading } from "../Heading";
import Image from "next/image";
import { Home, Send, Link as LinkIcon, Gamepad2, Music, Dumbbell, CarFront } from "lucide-react";

const ResumeLeftSide = () => {
    return (
        <div className={styles.resumeLeftSide}>
            <div className={styles.resumeLeftSideProfilPictureWrapper}>
                <Image src="/images/resume-photo.png" width={150} height={150} alt="" className="h-auto w-full" />
            </div>
            <Heading variant="h1" className={styles.resumeLeftSideName}>
                Alexandre ADOLPHE
            </Heading>
            <div className={styles.resumeLeftSideJob}>
                <p className={styles.resumeLeftSideJobContent}>Developpeur front - Simplon.co</p>
            </div>
            <section id="contact">
                <Heading variant="h2" className={styles.resumeLeftSideHeading}>
                    Contact
                </Heading>
                <ul className={styles.resumeLeftSideContactList}>
                    <li>
                        <span>
                            <Send size={14} className="stroke-yellow-resume" />
                        </span>
                        <p>alexandre.adolphepro@gmail.com</p>
                    </li>
                    <li>
                        <span>
                            <Home size={14} className="stroke-yellow-resume" />
                        </span>
                        <p>Sainte Suzanne</p>
                    </li>
                    <li>
                        <span>
                            <LinkIcon size={14} className="stroke-yellow-resume" />
                        </span>
                        <p>www.alexdevlab.com</p>
                    </li>
                </ul>
            </section>
            <section id="softSkills">
                <Heading variant="h2" className={styles.resumeLeftSideHeading}>
                    Soft skills
                </Heading>
                <ul className={styles.resumeLeftSideSkillsList}>
                    <li>Curiosité</li>
                    <li>Persévérance</li>
                    <li>Investit</li>
                </ul>
            </section>
            <section id="other">
                <Heading variant="h2" className={styles.resumeLeftSideHeading}>
                    Loisirs et divers
                </Heading>
                <ul className={styles.resumeLeftSideOtherList}>
                    <li>
                        <span>
                            <Gamepad2 size={16} className="stroke-yellow-resume" />
                        </span>
                        Jeux video
                    </li>
                    <li>
                        <span>
                            <Music size={16} className="stroke-yellow-resume" />
                        </span>
                        Musique
                    </li>
                    <li>
                        <span>
                            <Dumbbell size={16} className="stroke-yellow-resume" />
                        </span>
                        Sports
                    </li>
                    <li>
                        <span>
                            <CarFront size={16} className="stroke-yellow-resume" />
                        </span>
                        Permis & Véhicule
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default ResumeLeftSide;
