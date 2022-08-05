import React from "react";

export const Heading = ({ variant, className, children, ...props }) => {
    const Tag = variant || "h1";
    return (
        <Tag className={className} {...props}>
            {children}
        </Tag>
    );
};
