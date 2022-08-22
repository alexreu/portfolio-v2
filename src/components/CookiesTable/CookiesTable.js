import React from "react";
import style from "./CookiesTable.module.css";
import { id } from "../../modules/idGenerator";

export const CookiesTable = ({ head, content }) => {
    return (
        <figure className={style.cookiesTableFigure}>
            <table className={`${style.cookiesTable} dark:text-white`}>
                <thead className={style.cookiesTableHead}>
                    <tr>
                        {head.map(e => (
                            <th key={id()}>{e}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className={style.cookiesTableBody}>
                    {content.map(e => {
                        const { cookie, object, duration } = e;
                        return (
                            <tr key={id()} className="even:bg-midgray-lighter even:text-white">
                                <td>{cookie}</td>
                                <td>{object}</td>
                                <td>{duration}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </figure>
    );
};
