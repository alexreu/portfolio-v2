import styles from "./Resume.module.css";
import ResumeLeftSide from "./ResumeLeftSide";

export const Resume = () => {
    return (
        <div className={styles.resumeWrapper}>
            <div className={styles.resumeContent}>
                <ResumeLeftSide />
                <div className={styles.resumeRightSide}></div>
            </div>
        </div>
    );
};
