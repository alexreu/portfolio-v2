const WEDDING_TIME_ZONE = "Europe/Paris";

const parts = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: WEDDING_TIME_ZONE,
});

const partValue = (date: Date, type: "hour" | "minute") =>
    parts.formatToParts(date).find((part) => part.type === type)?.value ?? "00";

/** "16 h", "17 h 30": French typographic hours, read in the wedding's time zone. */
export const formatHour = (iso: string): string => {
    const date = new Date(iso);
    const hour = String(Number(partValue(date, "hour")));
    const minute = partValue(date, "minute");
    return minute === "00" ? `${hour} h` : `${hour} h ${minute}`;
};
