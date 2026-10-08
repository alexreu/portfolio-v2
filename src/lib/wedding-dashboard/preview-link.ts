/** The query mark of a visit made by the couple: nothing is counted as the guests' own. */
export const PREVIEW = "apercu";

/**
 * A link to the guest site, opened by the couple from their dashboard: the same page, but the
 * visit is not counted as the household's and an answer typed there is the couple's.
 */
export const previewOf = (link: string) => {
    const [address, anchor] = link.split("#");
    const [path, query = ""] = address.split("?");
    const params = query ? query.split("&") : [];
    if (params.some((param) => param.split("=")[0] === PREVIEW)) return link;
    return `${path}?${[...params, PREVIEW].join("&")}${anchor === undefined ? "" : `#${anchor}`}`;
};

/** Whether the page was opened as the couple's preview, from its search params. */
export const isPreview = (params: Readonly<Record<string, string | string[] | undefined>>) =>
    PREVIEW in params;
