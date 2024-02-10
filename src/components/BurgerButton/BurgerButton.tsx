import React, { HTMLAttributes } from "react";
import { Button } from "../Button";
import { Menu } from "lucide-react";

type Props = HTMLAttributes<HTMLButtonElement>;

export const BurgerButton = ({ className, ...props }: Props) => {
    return (
        <Button typeof="button" className={`relative flex items-center p-1 xl:hidden ${className}`} {...props}>
            <Menu size={32} />
            <span className="sr-only">déplier le menu mobile</span>
        </Button>
    );
};
