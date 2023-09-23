import React, { FC, HTMLAttributes } from "react";

type ButtonProps = {
    style: string;
} & HTMLAttributes<HTMLButtonElement>;
export const Button: FC<ButtonProps> = ({ style, children, ...props }) => {
    return (
        <button className={style} {...props}>
            {children}
        </button>
    );
};
