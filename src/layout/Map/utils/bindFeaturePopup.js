import { timeAgo } from "../../../utils/timeAgo";

/**
 * bindFeaturePopup
 * -----------------
 * Creates and attaches a Leaflet popup for an OSM feature.
 * Handles:
 * - geometry centroid calculation
 * - OSM + Google Maps links
 * - property filtering
 * - metadata footer
 */

export default function bindFeaturePopup(feature, layer, exclude) {
    const props = feature.properties || {};
    const geom = feature.geometry;

    if (!geom) {
        console.error("Missing geometry", feature);
        return;
    }

    let lon, lat;

    // -------------------------
    // Resolve feature center
    // -------------------------
    switch (geom.type) {
        case "Point":
            [lon, lat] = geom.coordinates;
            break;

        case "LineString": {
            const coords = geom.coordinates;
            const lons = coords.map(p => p[0]);
            const lats = coords.map(p => p[1]);

            lon = (Math.min(...lons) + Math.max(...lons)) / 2;
            lat = (Math.min(...lats) + Math.max(...lats)) / 2;
            break;
        }

        case "Polygon": {
            const ring = geom.coordinates[0];
            const lons = ring.map(p => p[0]);
            const lats = ring.map(p => p[1]);

            lon = (Math.min(...lons) + Math.max(...lons)) / 2;
            lat = (Math.min(...lats) + Math.max(...lats)) / 2;
            break;
        }

        case "MultiPolygon": {
            const ring = geom.coordinates[0][0];
            const lons = ring.map(p => p[0]);
            const lats = ring.map(p => p[1]);

            lon = (Math.min(...lons) + Math.max(...lats)) / 2;
            lat = (Math.min(...lats) + Math.max(...lats)) / 2;
            break;
        }

        default:
            console.error("Unknown geometry format", geom.type);
            return;
    }

    // -------------------------
    // OSM ID parsing
    // -------------------------
    const [featureType, osmID] = (feature.id || "").split("/");

    // -------------------------
    // Popup container
    // -------------------------
    const container = document.createElement("div");

    container.innerHTML = `
        <h2>
            <a
                href="https://www.openstreetmap.org/${featureType}/${osmID}"
                target="_blank"
                rel="noopener noreferrer"
            >
                ${featureType}: ${osmID}
            </a>
        </h2>

        <h3>
            <a
                href="https://www.google.com/maps?q=${lat},${lon}"
                target="_blank"
                rel="noopener noreferrer"
            >
                View in Google Maps
            </a>
        </h3>

        <h3>Tags</h3>
    `;

    // -------------------------
    // Feature properties
    // -------------------------
    Object.entries(props)
        .filter(([k]) => !exclude.has(k))
        .forEach(([key, value]) => {
            const row = document.createElement("div");
            row.textContent = `${key}: ${value}`;
            container.appendChild(row);
        });

    // -------------------------
    // Metadata footer
    // -------------------------
    if (props.timestamp) {
        const formattedDate = new Date(props.timestamp).toLocaleDateString("en-GB");
        const timeAgoText = timeAgo(props.timestamp);

        const editedRow = document.createElement("div");
        editedRow.style.marginTop = "8px";
        editedRow.style.fontSize = "12px";
        editedRow.style.opacity = "0.75";

        editedRow.innerHTML = `
            <strong>Last edited:</strong> ${formattedDate} (${timeAgoText})
            <br />
            <strong>Last edited by:</strong> ${props.user || "Unknown"}
        `;

        container.appendChild(editedRow);
    }

    layer.bindPopup(container);
}