import { Heading } from "../Heading";
import { SectionSubtitle } from "../SectionSubtitle";
import styles from "./SectionHead.module.css";

export const SectionHead = ({ title, subtitle, children }) => {
    return (
        <>
            {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
            <Heading variant="h2" className={`${styles.sectionHeadTitle} dark:text-white`}>
                {title}
            </Heading>
            {children && <p className={`${styles.sectionHeadDescription} dark:text-dark-body`}>{children}</p>}
        </>
    );
};
