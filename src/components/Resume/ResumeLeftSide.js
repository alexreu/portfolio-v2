import React from "react";
import styles from "./Resume.module.css";
import { Heading } from "../Heading";
import Image from "next/future/image";
import profilePicture from "../../../public/images/resume-photo.png";

const ResumeLeftSide = () => {
    return (
        <div className={styles.resumeLeftSide}>
            <div className={styles.resumeLeftSideProfilPictureWrapper}>
                <Image src="/images/resume-photo.png" width={150} height={150} alt="" className="w-full h-auto" />
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
                            <i className="bi bi-send-fill"></i>
                        </span>
                        <p>alexandre.adolphepro@gmail.com</p>
                    </li>
                    <li>
                        <span>
                            <i className="bi bi-house-door-fill"></i>
                        </span>
                        <p>Sainte Suzanne</p>
                    </li>
                    <li>
                        <span>
                            <i className="bi bi-terminal-fill"></i>
                        </span>
                        <p>www.alexandreadolphe.com</p>
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
                            <i className="bi bi-controller"></i>
                        </span>
                        Jeux video
                    </li>
                    <li>
                        <span>
                            <i className="bi bi-music-note-beamed"></i>
                        </span>
                        Guitare
                    </li>
                    <li>
                        <span>
                            <i className="bi bi-bicycle"></i>
                        </span>
                        Sports
                    </li>
                    <li>
                        <span>
                            <i className="bi bi-car-front"></i>
                        </span>
                        Permis & Véhicule
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default ResumeLeftSide;
