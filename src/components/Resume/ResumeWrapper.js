import React from "react";
import styles from "./Resume.module.css";
import ResumeLeftSide from "./ResumeLeftSide";
import ResumeRightSide from "./ResumeRightSide";
import Link from "next/link";
import { Button } from "../Button";

export const ResumeWrapper = ({ data }) => {
    const handlePrintButtonClick = () => {
        window.print();
    };
    return (
        <div className={styles.resumeWrapper}>
            <div className={styles.resumeContent}>
                <ResumeLeftSide />
                <ResumeRightSide data={data} />
            </div>
            <div className="flex flex-col gap-6 absolute bottom-9 right-8 print:hidden">
                <Button className={styles.resumeActionButton} onClick={handlePrintButtonClick}>
                    <i className="bi bi-printer-fill"></i>
                    <span className="sr-only">Imprimer le cv</span>
                </Button>
                <Link href="/">
                    <a className={styles.resumeActionButton}>
                        <i className="bi bi-arrow-left"></i>
                        <span className="sr-only">Retourner au portfolio</span>
                    </a>
                </Link>
            </div>
        </div>
    );
};
