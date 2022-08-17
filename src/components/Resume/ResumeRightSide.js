import styles from "./Resume.module.css";
import { Heading } from "../Heading";
import { Timeline } from "../Timeline";

const ResumeRightSide = ({ data }) => {
    return (
        <div className={styles.resumeRightSide}>
            <section>
                <div className={styles.resumeRightSideHeading}>
                    <Heading variant="h2">diplômes</Heading>
                    <i className="bi bi-mortarboard-fill"></i>
                </div>
                <Timeline data={data.find(e => e.id === "education")} />
            </section>
            <section>
                <div className={styles.resumeRightSideHeading}>
                    <Heading variant="h2">expériences</Heading>
                    <i className="bi bi-person-workspace"></i>
                </div>
                <Timeline data={data.find(e => e.id === "experiences")} />
            </section>
            <section>
                <div className={styles.resumeRightSideHeading}>
                    <Heading variant="h2">competences</Heading>
                    <i className="bi bi-gear-wide-connected"></i>
                </div>
                <Timeline data={data.find(e => e.id === "skills")} />
            </section>
        </div>
    );
};

export default ResumeRightSide;
