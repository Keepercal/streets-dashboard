import L from "leaflet";

export function createFeatureMarker(feature, latlng) {
    // Marker icons based on feature recency
    var pinGreen = L.icon({ // Size was previously 30
        iconUrl: './assets/pins/pinGreen.svg',
        iconSize: [26, 26],
        iconAnchor: [13, 26],

        popupAnchor: [0, -26],
    })

    var pinYellow = L.icon({
        iconUrl: './assets/pins/pinYellow.svg',
        iconSize: [26, 26],
        iconAnchor: [13, 26],

        popupAnchor: [0, -26],
    })

    var pinRed = L.icon({
        iconUrl: './assets/pins/pinRed.svg',
        iconSize: [26, 26],
        iconAnchor: [13, 26], // First parameter must be half of the second

        popupAnchor: [0, -26],
    })

    //console.log(feature.id, feature._matchesFilters);
    const match = feature._matchesFilters !== false;

    const timestamp = feature.properties?.timestamp;

    let icon = pinRed; // Default to red pin

    // Choose icon colour based on how recently the feature was edited
    if (timestamp) {
        const editedDate = new Date(timestamp);
        const daysSinceEdit = (Date.now() - editedDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceEdit <= 365) {
            icon = pinGreen; // Recently edited
        } else if (daysSinceEdit <= 1095.75) {
            icon = pinYellow; // Moderately old edit (~3 years)
        }
    }

    const marker = L.marker(latlng, { icon });

    // Visually dim filtered-out features
    if (!match) {
        marker.setOpacity(0.15);
        marker.off() // Disable clicks/popup
        marker.setZIndexOffset(match ? 1000 : 0);
    } else {
        marker.setOpacity(1);
        marker.setZIndexOffset(1000); // Keeps active markers on top
    }

    return marker;
}

export function stylePolygon(feature) {
    const match = feature._matchesFilters !== false;

    const timestamp = feature.properties?.timestamp; // When the feature was last edited
    const YEAR = 365;
    const THREE_YEARS = 3 * 365;

    let color = "#D83F29"; // Default to red

    if (timestamp) {
        const editedDate = new Date(timestamp);
        const daysSinceEdit = (Date.now() - editedDate.getTime()) / (1000 * 60 * 60 * 24); // Caculate days since last edit

        if (daysSinceEdit <= YEAR) { // Recent edit (< 1 year)
            color = "#739D55";
        } else if (daysSinceEdit <= THREE_YEARS) {
            color = "#E0C055"; // Moderately old edit (~3 years)
        }
    }

    if (!match) { // Dim the feature if has been filtered
        return {
            color,
            opacity: 0.15,
            weight: 2,
            fillOpacity: 0.05,
        };
    }

    return { // If not, use normal styling
        color,
        opacity: 1,
        weight: 3,
        fillOpacity: 0.2,
    };
}