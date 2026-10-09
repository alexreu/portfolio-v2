/** Where a section sits on screen, in pixels from the top of the viewport. */
export type SectionBox = { readonly id: string; readonly top: number; readonly bottom: number };

type Reading = {
    /** The reading line, from the top of the viewport: what crosses it is being read. */
    readonly line: number;
    readonly viewport: number;
    /** Scrolled to the bottom: a last section too short to reach the line still counts. */
    readonly atEnd: boolean;
};

/**
 * The menu's section being read: the one under the reading line, none between two sections
 * the menu does not lead to. At the end of the page, the last one in sight.
 */
export const activeSection = (
    boxes: readonly SectionBox[],
    { line, viewport, atEnd }: Reading,
): string | null => {
    if (atEnd) {
        const last = boxes.findLast((box) => box.top < viewport && box.bottom > 0);
        if (last) return last.id;
    }
    return boxes.find((box) => box.top <= line && box.bottom > line)?.id ?? null;
};
