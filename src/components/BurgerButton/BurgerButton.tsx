import React, { HTMLAttributes } from "react";
import { Button } from "../Button";

type Props = HTMLAttributes<HTMLButtonElement>;

export const BurgerButton = ({ className, ...props }: Props) => {
    return (
        <Button typeof="button" className={`flex items-center relative xl:hidden p-1 ${className}`} {...props}>
            <i className="bi bi-list text-[35px]" />
            <span className="sr-only">Ouvrir le menu</span>
        </Button>
    );
};
