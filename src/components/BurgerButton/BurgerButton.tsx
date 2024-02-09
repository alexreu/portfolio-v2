import React, { HTMLAttributes } from "react";
import { Button } from "../Button";
import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";

type Props = HTMLAttributes<HTMLButtonElement>;

export const BurgerButton = ({ className, ...props }: Props) => {
    return (
        <Button typeof="button" className={`flex items-center relative xl:hidden p-1 ${className}`} {...props}>
            <Icon path={mdiMenu} size="32px" />
            <span className="sr-only">déplier le menu mobile</span>
        </Button>
    );
};
