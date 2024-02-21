import React from "react";
import style from "./CookiesTable.module.css";
import { id } from "../../modules/idGenerator";

type Props = {
    head: string[];
    content: Record<string, string>[];
};

export const CookiesTable = ({ head, content }: Props) => {
    return (
        <figure className={style.cookiesTableFigure}>
            <table className={`${style.cookiesTable} dark:text-white`}>
                <thead className={`${style.cookiesTableHead} dark:bg-midgray-lighter`}>
                    <tr>
                        {head.map(e => (
                            <th key={id()} className="dark:text-white">
                                {e}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={style.cookiesTableBody}>
                    {content.map(({ cookie, object, duration }) => (
                        <tr key={id()} className={`${style.cookiesTableBodyRow} even:dark:bg-midgray-lighter`}>
                            <td>{cookie}</td>
                            <td>{object}</td>
                            <td>{duration}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </figure>
    );
};
