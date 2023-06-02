import React from "react";
import styles from "./Timeline.module.css";
import { Heading } from "../Heading";
import { id } from "../../modules/idGenerator";

export const Timeline = ({ data }) => {
    const { content } = data;
    return (
        <ul className={styles.timeline}>
            {content.map(e => {
                const { title, description, date } = e;
                return (
                    <li key={`${title}-${id()}`} className={styles.timelineChild}>
                        {data.id === "skills" ? (
                            <Heading variant="h3">{description}</Heading>
                        ) : (
                            <Heading variant="h3">
                                {title}
                                {date && <span className="ml-2 text-yellow-resume">{date}</span>}
                            </Heading>
                        )}
                        {data.id === "experiences" && <p>{description}</p>}
                    </li>
                );
            })}
        </ul>
    );
};
