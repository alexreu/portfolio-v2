import type { SiteMode } from "./site-mode";

export type TabEmphasis = "normal" | "primary" | "done";

export type Tab = {
    readonly key: string;
    readonly label: string;
    readonly href: string;
    readonly emphasis: TabEmphasis;
};

/** Only the action that matters right now gets the filled style. */
const answerTab = (answered: boolean): Tab =>
    answered
        ? { key: "reponse", label: "Répondu", href: "#rsvp", emphasis: "done" }
        : { key: "reponse", label: "Répondre", href: "#rsvp", emphasis: "primary" };

const programmeTab: Tab = {
    key: "programme",
    label: "Programme",
    href: "#programme",
    emphasis: "normal",
};
const placesTab: Tab = { key: "lieux", label: "Lieux", href: "#lieux", emphasis: "normal" };

/** Before the wedding the gallery is empty, so no photo tab; on the day, answers are closed. */
export const tabBar = (mode: SiteMode, state: { readonly answered: boolean }): readonly Tab[] =>
    mode === "day"
        ? [
              programmeTab,
              { key: "table", label: "Ma table", href: "#jourj", emphasis: "normal" },
              { key: "ajouter", label: "Ajouter", href: "#photos", emphasis: "primary" },
              placesTab,
          ]
        : [
              programmeTab,
              placesTab,
              { key: "questions", label: "Questions", href: "#faq", emphasis: "normal" },
              answerTab(state.answered),
          ];
