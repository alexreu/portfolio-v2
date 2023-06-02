import { motion } from "framer-motion";
import styles from "./ServiceCard.module.css";
import { Heading } from "../Heading";

export const ServiceCard = ({ icon, title, description }) => {
    return (
        <motion.div
            whileHover={{
                translateY: "5px",
                boxShadow: "0 10px 15px 0 rgba(253,71,102,0.2)",
            }}
            transition={{ type: "spring", stiffness: 500, damping: 20, duration: 0.2 }}
            className={`${styles.card} dark:bg-[rgb(12,12,12)]`}
        >
            <Heading variant="h3" className={`${styles.cardHeading} dark:text-white`}>
                {title}
            </Heading>
            <i className={`bi bi-${icon} ${styles.cardIcon}`}></i>
            <p className={`${styles.cardDescription} dark:text-dark-body`}>{description}</p>
        </motion.div>
    );
};
