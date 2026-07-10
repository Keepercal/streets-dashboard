import L from "leaflet";
import createPinIcon from "../../../utils/createPinIcon";

const defaultBlue = "#3388ff";

const green = "#739D55";
const yellow = "#E0C055";
const red = "#D83F29";

/* Pin Icons (created once — NOT per marker render) */
const defaultPin = createPinIcon(defaultBlue);

const pinGreen = createPinIcon(green);
const pinYellow = createPinIcon(yellow);
const pinRed = createPinIcon(red);

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
export function createFeatureMarker(feature, latlng, displayMode) {
    const match = feature._matchesFilters !== false;

    const daysSinceEdit = getDaysSinceEdit(
        feature.properties?.timestamp
    );

    const icon = 
        displayMode === "lastEdited"
            ? getIconByAge(daysSinceEdit)
            : defaultPin

    const marker = L.marker(latlng, { icon });

    /* Filter visual state */
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
export function stylePolygon(feature, displayMode) {
    const match = feature._matchesFilters !== false;

    

    const YEAR = 365;
    const THREE_YEARS = 3 * YEAR;

    let color = defaultBlue; // default red

    /* DEFAULT VIEW */
    if (displayMode === "lastEdited"){

        const daysSinceEdit = getDaysSinceEdit(
            feature.properties?.timestamp
        );

        if (daysSinceEdit == null){
            color = red;
        } else if (daysSinceEdit <= YEAR){
            color = green
        } else if (daysSinceEdit <= THREE_YEARS){
            color = yellow;
        } else{
            color = red;
        }
    }

    /* Filtered styling (dimmed state) */
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