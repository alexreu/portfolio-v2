import React from "react";
import { Button } from "../Button";

export const BurgerButton = ({ onClick, style }) => {
    return (
        <Button onClick={onClick} type="button" style={`flex items-center relative lg:hidden p-1 ${style}`}>
            <i className="bi bi-list text-[35px]" />
            <span className="sr-only">Ouvrir le menu</span>
        </Button>
    );
};
