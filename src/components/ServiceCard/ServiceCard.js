import styles from "./ServiceCard.module.css";
import { Heading } from "../Heading";

export const ServiceCard = ({ icon, title, description }) => {
    return (
        <div className={`${styles.card} dark:bg-[rgb(12,12,12)]`}>
            <Heading variant="h3" className={`${styles.cardHeading} dark:text-white`}>
                {title}
            </Heading>
            <i className={`bi bi-${icon} ${styles.cardIcon}`}></i>
            <p className={`${styles.cardDescription} dark:text-dark-body`}>{description}</p>
        </div>
    );
};
