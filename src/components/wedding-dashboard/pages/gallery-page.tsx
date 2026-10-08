"use client";

import { useDashboard } from "../dashboard-context";
import { PageHeader } from "../dashboard-ui";
import { GallerySection } from "../gallery-section";

export const GalleryPage = () => {
    const { state, dispatch, calendar, at } = useDashboard();
    return (
        <>
            <PageHeader page="galerie" />
            <GallerySection
                photos={state.photos}
                opensLabel={calendar.galleryOpensLabel}
                onToggle={(photo) =>
                    dispatch({ type: "photo-toggled", photoId: photo.id, at: at() })
                }
            />
        </>
    );
};
