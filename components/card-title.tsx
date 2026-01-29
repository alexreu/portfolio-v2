import React from "react";

export const CardTitle = ({ ...props }) => {
    return (
        <h1 className="text-primary text-xl leading-none font-semibold tracking-tight" {...props} />
    );
};
