import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};
export default function Layout({ children }: Props) {
    return <main className="h-screen w-screen overflow-x-auto overflow-y-scroll">{children}</main>;
}
