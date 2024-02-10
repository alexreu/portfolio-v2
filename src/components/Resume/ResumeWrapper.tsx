"use client";

import React, { useEffect, useState } from "react";
import styles from "./Resume.module.css";
import ResumeLeftSide from "./ResumeLeftSide";
import ResumeRightSide from "./ResumeRightSide";
import Link from "next/link";
import { Button } from "../Button";
import { Loader } from "../Loader";

export const ResumeWrapper = ({ data }) => {
    const [showResume, setShowResume] = useState(false);
    const handlePrintButtonClick = () => {
        window.print();
    };

    useEffect(() => {
        const checkWindowWidth = () => {
            if (window.innerWidth <= 1170) {
                setShowResume(false);
            } else {
                setShowResume(true);
            }
        };
        checkWindowWidth();
        window.addEventListener("resize", checkWindowWidth);
    }, []);

    return showResume ? (
        <div className={styles.resumeWrapper}>
            <div className={styles.resumeContent}>
                <ResumeLeftSide />
                <ResumeRightSide data={data} />
            </div>
            <div className="absolute bottom-9 right-8 flex flex-col gap-6 print:hidden">
                <Button className={styles.resumeActionButton} onClick={handlePrintButtonClick}>
                    <i className="bi bi-printer-fill"></i>
                    <span className="sr-only">Imprimer le cv</span>
                </Button>
                <Link href="/" className={styles.resumeActionButton}>
                    <i className="bi bi-arrow-left"></i>
                    <span className="sr-only">Retourner au portfolio</span>
                </Link>
            </div>
        </div>
    ) : (
        <Loader />
    );
};
