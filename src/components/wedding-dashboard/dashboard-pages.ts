import {
    Armchair,
    BellRing,
    CalendarDays,
    Images,
    KeyRound,
    LayoutGrid,
    Stamp,
    Users,
    type LucideIcon,
} from "lucide-react";

import { DASHBOARD_PATH, type DashboardPage } from "@/lib/wedding-dashboard/pages";

export type DashboardEntry = {
    /** Null for the overview, the dashboard's home. */
    readonly page: DashboardPage | null;
    readonly label: string;
    readonly icon: LucideIcon;
    /** Under the page's title. */
    readonly intro: string;
};

/** The menu, in order: one page per function, so each can be opened or hidden for a person. */
export const dashboardEntries: readonly DashboardEntry[] = [
    {
        page: null,
        label: "Vue d'ensemble",
        icon: LayoutGrid,
        intro: "Les réponses, les chiffres du traiteur et ce qui vient de se passer.",
    },
    {
        page: "invites",
        label: "Invités",
        icon: Users,
        intro: "Chaque foyer, son lien personnel et sa réponse, moment par moment.",
    },
    {
        page: "programme",
        label: "Programme et dates",
        icon: CalendarDays,
        intro: "Le jour J, la date limite des réponses, et les moments auxquels vous invitez.",
    },
    {
        page: "plan-de-table",
        label: "Plan de table",
        icon: Armchair,
        intro: "La salle du dîner, ses tables, et qui s'assoit où.",
    },
    {
        page: "faire-part",
        label: "Faire-part",
        icon: Stamp,
        intro: "Ce que vos invités lisent en ouvrant leur lien, et ce que vous leur demandez.",
    },
    {
        page: "relances",
        label: "Relances",
        icon: BellRing,
        intro: "Les foyers sans réponse, relancés pour vous, et tout ce qui s'est passé.",
    },
    {
        page: "galerie",
        label: "Galerie",
        icon: Images,
        intro: "Les photos partagées par vos invités, le jour J et après.",
    },
    {
        page: "acces",
        label: "Accès",
        icon: KeyRound,
        intro: "Qui d'autre que vous deux ouvre ce tableau de bord, et pour quoi faire.",
    },
];

export const dashboardHref = (page: DashboardPage | null) =>
    page ? `${DASHBOARD_PATH}/${page}` : DASHBOARD_PATH;

export const dashboardEntry = (page: DashboardPage) =>
    dashboardEntries.find((entry) => entry.page === page)!;
