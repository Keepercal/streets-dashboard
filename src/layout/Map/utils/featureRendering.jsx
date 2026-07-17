import L from "leaflet";
import createPinIcon from "../../../utils/createPinIcon";

import getDaysSinceEdit from "./getDaysSinceEdit"

/*const green = "#739D55"; // old colours
const yellow = "#E0C055";
const red = "#D83F29";*/

const defaultBlue = "#3388ff";
const green = "#5ba328"; // new colours
const yellow = "#e7bb2d";
const red = "#dd351b";

const pinGreen = createPinIcon(green);
const pinYellow = createPinIcon(yellow);
const pinRed = createPinIcon(red);

const pinCache = new Map();

/* Retrieve pin from cache */
// If pin is not stored in cache, add it to cache
function getPin(colour){
    const pinColour = colour ?? defaultBlue; // If no colour, default to blue

    if (!pinCache.has(pinColour)){ // Cache pin colour
        pinCache.set(pinColour, createPinIcon(pinColour));
    }

    return pinCache.get(pinColour);
}

/* Choose marker icon based on feature age */
function getIconByAge(days) {
    if (days == null) return pinRed;
    if (days <= 365) return pinGreen;
    if (days <= 3 * 365) return pinYellow;

    return pinRed;
}

function createDotMarker(latlng, colour){
    return L.circleMarker(latlng, {
        opacity: 0.5,
        radius: 4,
        color: "white",
        fillColor: colour ?? defaultBlue,
        fillOpacity: 0.8,
        weight: 1,
    });
}

/* Create marker for point features */
export function createFeatureMarker(
    feature, 
    latlng, 
    displayMode, 
    colour, 
    overview = false
) {
    const match = feature._matchesFilters !== false;

    /* Filter visual state */
    // If feature doesn't satisfy the current filters, alter display
    if (!match){
        return null;
    }

    if (overview){
        return createDotMarker(latlng, colour ?? defaultBlue)
    }

    /*if (!match){
      marker.setOpacity(0.10); // dim icon (worse performance)
        marker.remove(); 
        marker.setZIndexOffset(0);
        marker.off(); // disables interaction 

        return null;
    }*/

    if (displayMode === "heatmap"){
        return createDotMarker(latlng, colour ?? defaultBlue)
    }

    const daysSinceEdit = getDaysSinceEdit(feature.properties?.timestamp);

    const icon = 
        displayMode === "lastEdited"
            ? getIconByAge(daysSinceEdit)
            : getPin(colour)


    const marker = L.marker(latlng, { icon });

    marker.setOpacity(1);
    marker.setZIndexOffset(1000);

    return marker;
}

/* Polygon styling based on age + filter state */
export function stylePolygon(feature, displayMode, colour) {
    const match = feature._matchesFilters !== false;

    const YEAR = 365;
    const THREE_YEARS = 3 * YEAR;

    colour = colour ?? defaultBlue; // default blue

    /* DISPLAY FEATURES BY AGE */
    if (displayMode === "lastEdited"){

        const daysSinceEdit = getDaysSinceEdit(
            feature.properties?.timestamp
        );

        if (daysSinceEdit == null){
            colour = red;
        } else if (daysSinceEdit <= YEAR){
            colour = green
        } else if (daysSinceEdit <= THREE_YEARS){
            colour = yellow;
        } else{
            colour = red;
        }
    }

    /* Filtered styling (dimmed state) */
    if (!match) {
        return {
            color: colour,
            opacity: 0.10,
            weight: 2,
            fillOpacity: 0.15,
            interactive: false,
        };
    }

    return {
        color: colour,
        opacity: 1,
        weight: 3,
        fillOpacity: 0.2,
    };
}