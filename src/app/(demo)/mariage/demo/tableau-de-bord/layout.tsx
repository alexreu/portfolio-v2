import type { ReactNode } from "react";

import { DashboardShell } from "@/components/wedding-dashboard/dashboard-shell";
import { cormorant } from "@/app/fonts/wedding";

type Props = {
    children: ReactNode;
};

/** The couple's side of the demo, in the platform's ivory and gold rather than the site's. */
export default function WeddingDashboardDemoLayout({ children }: Props) {
    return (
        <div className={`${cormorant.variable} bg-wed-ivory text-wed-ink font-main min-h-dvh`}>
            <DashboardShell>{children}</DashboardShell>
        </div>
    );
}
