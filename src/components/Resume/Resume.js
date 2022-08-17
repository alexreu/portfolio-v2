import styles from "./Resume.module.css";
import ResumeLeftSide from "./ResumeLeftSide";
import ResumeRightSide from "./ResumeRightSide";

export const Resume = ({ data }) => {
    return (
        <div className={styles.resumeWrapper}>
            <div className={styles.resumeContent}>
                <ResumeLeftSide />
                <ResumeRightSide data={data} />
            </div>
        </div>
    );
};
