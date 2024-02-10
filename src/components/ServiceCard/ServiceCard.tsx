import { motion } from "framer-motion";
import { Heading } from "../Heading";

export const ServiceCard = ({ icon, title, description }) => {
    return (
        <motion.div
            whileHover={{
                translateY: "5px",
                boxShadow: "0 10px 15px 0 rgba(253,71,102,0.2)",
            }}
            transition={{ type: "spring", stiffness: 500, damping: 20, duration: 0.2 }}
            className="flex h-full flex-col gap-5 rounded-lg bg-white px-8 py-10 text-left dark:bg-[rgb(12,12,12)]"
        >
            {icon}
            <Heading variant="h3" className="text-xl font-semibold dark:text-white">
                {title}
            </Heading>
            <p className="text-base font-light text-gray dark:text-dark-body">{description}</p>
        </motion.div>
    );
};
