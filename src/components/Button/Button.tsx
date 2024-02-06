import React, { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLButtonElement>;
export const Button = ({ ...props }: Props) => <button {...props} />;
