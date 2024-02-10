import React, { FC, HTMLAttributes } from "react";

type HeadingProps = {
    variant?: "h1" | "h2" | "h3" | "h4" | "h5";
    className?: string;
} & HTMLAttributes<HTMLHeadingElement>;

export const Heading: FC<HeadingProps> = ({ variant = "h1", className, children, ...props }) => {
    const Tag = variant;

    return (
        <Tag className={className} {...props}>
            {children}
        </Tag>
    );
};
