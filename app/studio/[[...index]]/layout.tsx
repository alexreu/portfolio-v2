import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};
export default function Layout({ children }: Props) {
    return <section className="bg-white">{children}</section>;
}
