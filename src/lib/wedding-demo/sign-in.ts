import { collaboratorStatus, type WeddingState } from "@alexreu/wedding-core";

/** The couple's addresses in the demo: the accounts AlexDevLab created for them. */
export const COUPLE_EMAILS = ["camille.durand@exemple.fr", "hugo.lambert@exemple.fr"] as const;

export type SignInTarget =
    | { readonly kind: "couple" }
    | {
          readonly kind: "collaborator";
          readonly id: string;
          readonly firstName: string;
          readonly status: "active" | "pending" | "expired";
      };

/**
 * Who a magic link would open the dashboard to: one of the couple, someone they invited, or no
 * one. The page always answers the same, so nobody learns who has an account.
 */
export const signInTarget = (
    state: Pick<WeddingState, "collaborators">,
    email: string,
    now: Date,
): SignInTarget | null => {
    const address = email.trim().toLowerCase();
    if (address === "") return null;
    if ((COUPLE_EMAILS as readonly string[]).includes(address)) return { kind: "couple" };
    const person = state.collaborators.find((collaborator) => collaborator.email === address);
    return person
        ? {
              kind: "collaborator",
              id: person.id,
              firstName: person.firstName,
              status: collaboratorStatus(person, now).kind,
          }
        : null;
};
