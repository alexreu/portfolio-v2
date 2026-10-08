/** The seal's colours the demo offers: tokens of its theme, kept in the faire-part's design. */
export type SealTone = "olive" | "earth" | "ink";

export const isSealTone = (tone: string): tone is SealTone =>
    tone === "olive" || tone === "earth" || tone === "ink";

/** The tone a design stores, as the demo can draw it: olive when the theme has another. */
export const sealToneOf = (tone: string): SealTone => (isSealTone(tone) ? tone : "olive");
