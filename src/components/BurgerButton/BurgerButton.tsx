import React from "react";
import { Button } from "../Button";

export const BurgerButton = ({ onClick, style }) => {
    return (
        <Button onClick={onClick} typeof="button" style={`flex items-center relative xl:hidden p-1 ${style}`}>
            <i className="bi bi-list text-[35px]" />
            <span className="sr-only">Ouvrir le menu</span>
        </Button>
    );
};
