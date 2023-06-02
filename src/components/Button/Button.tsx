import React from "react";

export const Button = ({ style, children, ...props }) => {
    return (
        <button className={style} {...props}>
            {children}
        </button>
    );
};
