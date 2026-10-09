import type { DashboardPage } from "@alexreu/wedding-core";

/** Where the dashboard demo lives; its overview is the home of the dashboard. */
export const DASHBOARD_PATH = "/mariage/demo/tableau-de-bord";

/** Each page's segment in the address, in French for the visitors. */
export const PAGE_ROUTES: Readonly<Record<DashboardPage, string>> = {
    guests: "invites",
    programme: "programme",
    seating: "plan-de-table",
    invitation: "faire-part",
    reminders: "relances",
    gallery: "galerie",
    access: "acces",
    settings: "reglages",
};

export const dashboardHref = (page: DashboardPage | null) =>
    page ? `${DASHBOARD_PATH}/${PAGE_ROUTES[page]}` : DASHBOARD_PATH;

/** The page an address opens, null for the overview. */
export const pageAt = (pathname: string): DashboardPage | null =>
    (Object.keys(PAGE_ROUTES) as DashboardPage[]).find((page) =>
        pathname.replace(/\/$/, "").startsWith(dashboardHref(page)),
    ) ?? null;

/** `?commun`: the guest site as the shared faire-part's code opens it, addressed to nobody. */
export const SHARED_MARK = "commun";
