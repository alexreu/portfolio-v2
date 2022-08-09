import { Heading } from "../Heading";
import { SectionSubtitle } from "../SectionSubtitle";
import styles from "./SectionHead.module.css";

export const SectionHead = ({ title, subtitle, children }) => {
    return (
        <>
            <SectionSubtitle>{subtitle}</SectionSubtitle>
            <Heading variant="h2" className={`${styles.sectionHeadTitle} dark:text-white`}>
                {title}
            </Heading>
            <p className={`${styles.sectionHeadDescription} dark:text-dark-body`}>{children}</p>
        </>
    );
};
