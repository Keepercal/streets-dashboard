import L from "leaflet";

/**
 * ICONS (created once — NOT per marker render)
 */

const pinGreen = L.icon({
    iconUrl: "./assets/pins/pinGreen.svg",
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26],
});

const pinYellow = L.icon({
    iconUrl: "./assets/pins/pinYellow.svg",
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26],
});

const pinRed = L.icon({
    iconUrl: "./assets/pins/pinRed.svg",
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26],
});

/**
 * Returns edit age in days
 */
function getDaysSinceEdit(timestamp) {
    if (!timestamp) return null;

    const editedDate = new Date(timestamp);
    return (Date.now() - editedDate.getTime()) / (1000 * 60 * 60 * 24);
}

/**
 * Choose marker icon based on feature age
 */
function getIconByAge(days) {
    if (days == null) return pinRed;

    if (days <= 365) return pinGreen;
    if (days <= 3 * 365) return pinYellow;

    return pinRed;
}

/**
 * Create marker for point features
 */
export function createFeatureMarker(feature, latlng) {
    const match = feature._matchesFilters !== false;
    const daysSinceEdit = getDaysSinceEdit(feature.properties?.timestamp);

    const icon = getIconByAge(daysSinceEdit);

    const marker = L.marker(latlng, { icon });

    // ---------------------------------
    // Filter visual state
    // ---------------------------------
    if (!match) {
        marker.setOpacity(0.15);
        marker.setZIndexOffset(0);
        marker.off(); // disables interaction
    } else {
        marker.setOpacity(1);
        marker.setZIndexOffset(1000);
    }

    return marker;
}

/**
 * Polygon styling based on age + filter state
 */
export function stylePolygon(feature) {
    const match = feature._matchesFilters !== false;

    const daysSinceEdit = getDaysSinceEdit(feature.properties?.timestamp);

    const YEAR = 365;
    const THREE_YEARS = 3 * YEAR;

    let color = "#D83F29"; // default red

    if (daysSinceEdit != null) {
        if (daysSinceEdit <= YEAR) {
            color = "#739D55"; // green
        } else if (daysSinceEdit <= THREE_YEARS) {
            color = "#E0C055"; // yellow
        }
    }

    // ---------------------------------
    // Filtered styling (dimmed state)
    // ---------------------------------
    if (!match) {
        return {
            color,
            opacity: 0.15,
            weight: 2,
            fillOpacity: 0.15,
            interactive: false,
        };
    }

    return {
        color,
        opacity: 1,
        weight: 3,
        fillOpacity: 0.2,
    };
}