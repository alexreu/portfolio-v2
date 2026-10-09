"use client";

import { useEffect, useState } from "react";

/** The current time, refreshed every `everyMs`: enough for "il y a 4 min". */
export const useNow = (everyMs = 30_000) => {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), everyMs);
        return () => window.clearInterval(timer);
    }, [everyMs]);
    return now;
};
