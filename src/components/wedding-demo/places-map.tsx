"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useRef } from "react";
import L from "leaflet";

import styles from "./places-map.module.css";

export type MapPlace = {
    readonly name: string;
    readonly address: string;
    readonly coordinates: { readonly lat: number; readonly lng: number };
};

/**
 * OpenStreetMap's own tiles: fine for a demo. A couple's live site would point this at a
 * tile provider with an agreement (MapTiler, Stadia…), the styling stays the same.
 */
const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const ZOOM = 14;

const pin = L.divIcon({
    className: "",
    html: `<svg class="${styles.pin}" viewBox="0 0 36 46" width="36" height="46" aria-hidden="true"><path d="M18 1.5C8.9 1.5 1.5 8.7 1.5 17.6 1.5 29.8 18 44.5 18 44.5s16.5-14.7 16.5-26.9C34.5 8.7 27.1 1.5 18 1.5Z" fill="var(--demo-olive)" stroke="var(--demo-card)" stroke-width="2"/><circle cx="18" cy="17.5" r="5.5" fill="var(--demo-card)"/></svg>`,
    iconSize: [36, 46],
    iconAnchor: [18, 45],
    popupAnchor: [0, -42],
});

/** Built from text nodes: names and addresses will come from the CMS, never as HTML. */
const popupFor = (place: MapPlace) => {
    const content = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = place.name;
    name.style.cssText =
        "display:block;font-family:var(--font-demo-serif);font-size:1.15rem;font-weight:500";
    const address = document.createElement("span");
    address.textContent = place.address;
    content.append(name, address);
    return content;
};

/** The places on a map in the site's tones: pan, zoom and touch a pin for its address. */
export const PlacesMap = ({ places }: { places: readonly MapPlace[] }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current || places.length === 0) return;
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        /** One finger on a phone scrolls the page; panning stays for mouse and trackpad. */
        const mouse = window.matchMedia("(pointer: fine)").matches;
        const map = L.map(container.current, {
            scrollWheelZoom: false,
            dragging: mouse,
            zoomAnimation: !still,
            fadeAnimation: !still,
            markerZoomAnimation: !still,
        });
        map.attributionControl.setPrefix(false);
        L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
        places.forEach((place) =>
            L.marker([place.coordinates.lat, place.coordinates.lng], {
                icon: pin,
                title: place.name,
                alt: place.name,
                riseOnHover: true,
            })
                .bindPopup(popupFor(place))
                .addTo(map),
        );
        const points = places.map((place) =>
            L.latLng(place.coordinates.lat, place.coordinates.lng),
        );
        if (points.length === 1) map.setView(points[0], ZOOM);
        else map.fitBounds(L.latLngBounds(points), { padding: [48, 48] });
        return () => {
            map.remove();
        };
    }, [places]);

    return <div ref={container} className={`${styles.map} absolute inset-0`} />;
};
