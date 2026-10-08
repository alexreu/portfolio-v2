import { collaboratorStatus } from "./access";
import { daysUntil, sinceLabel, type WeddingCalendar } from "./calendar";
import { seatingPlan } from "./seating";
import { overview } from "./stats";
import type { DemoState } from "./types";

/** Where the dashboard demo lives; its overview is the home of the dashboard. */
export const DASHBOARD_PATH = "/mariage/demo/tableau-de-bord";

/** The dashboard's pages besides the overview, by their path under the dashboard. */
export type DashboardPage =
    | "invites"
    | "programme"
    | "plan-de-table"
    | "faire-part"
    | "relances"
    | "galerie"
    | "acces";

const plural = (count: number, one: string, many: string) => `${count} ${count > 1 ? many : one}`;

const reminders = (state: DemoState, calendar: WeddingCalendar, now: Date) => {
    if (daysUntil(calendar.reminderDay, now) >= 0) return `Prochaine le ${calendar.reminderLabel}`;
    if (!state.lastReminder) return "Pas de relance prévue";
    return `Dernière ${sinceLabel(state.lastReminder.at, now)}, à ${plural(state.lastReminder.count, "foyer", "foyers")}`;
};

const access = (state: DemoState, now: Date) => {
    const { collaborators } = state;
    if (collaborators.length === 0) return "Vous deux seulement";
    const count = (kind: "pending" | "expired") =>
        collaborators.filter((collaborator) => collaboratorStatus(collaborator, now).kind === kind)
            .length;
    const waiting = count("pending");
    const expired = count("expired");
    return [
        plural(collaborators.length, "personne", "personnes"),
        ...(waiting > 0 ? [`${plural(waiting, "invitation", "invitations")} en attente`] : []),
        ...(expired > 0
            ? [`${plural(expired, "invitation expirée", "invitations expirées")}`]
            : []),
    ].join(" · ");
};

/** One line per page, on the overview's shortcuts: what is waiting there. */
export const pageSummaries = (
    state: DemoState,
    calendar: WeddingCalendar,
    now: Date,
): Readonly<Record<DashboardPage, string>> => {
    const { households, pending } = overview(state.households);
    const { unseated } = seatingPlan(state.households, state.tables, state.seats);
    const visible = state.photos.filter((photo) => !photo.removed).length;
    return {
        invites:
            households === 0
                ? "Aucun foyer pour l'instant"
                : `${plural(households, "foyer", "foyers")} · ${pending > 0 ? `${pending} sans réponse` : "tous ont répondu"}`,
        programme: `${plural(state.moments.length, "moment", "moments")} · réponses avant le ${calendar.answerDeadlineLabel}`,
        "plan-de-table":
            state.tables.length === 0
                ? "Aucune table pour l'instant"
                : `${plural(state.tables.length, "table", "tables")} · ${unseated.length > 0 ? `${plural(unseated.length, "invité", "invités")} sans table` : "tout le monde est placé"}`,
        "faire-part":
            state.questions.length > 0
                ? `${plural(state.questions.length, "question", "questions")} aux invités`
                : "Sans question",
        relances: reminders(state, calendar, now),
        galerie: `${plural(visible, "photo visible", "photos visibles")} · ouverture le ${calendar.galleryOpensLabel}`,
        acces: access(state, now),
    };
};
