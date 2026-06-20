import { timeAgo } from '../../../utils/timeAgo'

export default function bindFeaturePopup(feature, layer, exclude){
    const props = feature.properties || {};
    const lastUser = props.user; // Last user to edit feature
    const geom = feature.geometry
    let lon, lat;

    if (!geom) { // Throw if the feature is missing geometry
        console.error("Missing geometry", feature);
        return;
    }

    if (geom.type === "Point") { // If the feature is a Point (Node), update lon lat from array
        [lon, lat] = geom.coordinates;
    }

    else if (geom.type === "LineString") { // If the feature is a LineString, calculate the centre
        // geometry is array of {lat, lon}
        const coords = geom.coordinates;

        const lons = coords.map(p => p[0]);
        const lats = coords.map(p => p[1]);

        lon = (Math.min(...lons) + Math.max(...lons)) / 2;
        lat = (Math.min(...lats) + Math.max(...lats)) / 2;

        console.log("way")
    }

    else if (geom.type === "Polygon") { // If the feature is a Polygon, calculate the centre
        const ring = geom.coordinates[0]; // outer ring

        const lons = ring.map(p => p[0]);
        const lats = ring.map(p => p[1]);

        lon = (Math.min(...lons) + Math.max(...lons)) / 2;
        lat = (Math.min(...lats) + Math.max(...lats)) / 2;
    }

    else if (geom.type === "MultiPolygon") { // If the feature is a MultiPolygon, calculate the centre
        const ring = geom.coordinates[0][0];

        const lons = ring.map(p => p[0]);
        const lats = ring.map(p => p[1]);

        lon = (Math.min(...lons) + Math.max(...lons)) / 2;
        lat = (Math.min(...lats) + Math.max(...lats)) / 2;
    }

    else {
        console.error("Unknown geometry format", geom.type);
        return;
    }

    // Split OSM feature ID (e.g. "node/12345")
    const [featureType, osmID] = feature.id.split("/");

    // Container for popup DOM content
    const container = document.createElement("div");

    // Header with link to OpenStreetMap feature page
    const title = document.createElement("div");

    title.innerHTML = ` 
                        <h2>
                            <a
                                href="https://www.openstreetmap.org/${featureType}/${osmID}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ${featureType}: ${osmID} 
                            </a>
                        </h2>
                    `;

    // Section for link to Google Maps
    const googleLink = document.createElement("div");

    googleLink.innerHTML = `
                        <h3>
                            <a
                                href="https://www.google.com/maps?q=${lat},${lon}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View in Google Maps
                            </a>
                        </h3>
                    `;

    // Section header for tags/properties
    const subtitle = document.createElement("div");
    subtitle.innerHTML = `<h3>Tags</h3>`;

    // Populate the popup
    container.appendChild(title);
    container.appendChild(googleLink)
    container.appendChild(subtitle);

    // Render all feature properties except excluded metadata fields
    Object.entries(props)
        .filter(([k]) => !exclude.has(k))
        .forEach(([key, value]) => {
            const row = document.createElement("div");
            row.textContent = `${key}: ${value}`;
            container.appendChild(row);
        });

    // Add metadata footer if feature has edit timestamp
    if (props.timestamp) {
        const formattedDate =
            new Date(props.timestamp).toLocaleDateString("en-GB");

        const timeAgoText = timeAgo(props.timestamp);

        const editedRow = document.createElement("div");
        editedRow.style.marginTop = "8px";
        editedRow.style.fontSize = "12px";
        editedRow.style.opacity = "0.75";

        editedRow.innerHTML = `
                            <strong>Last edited:</strong> ${formattedDate} (${timeAgoText})
                            <strong>Last edited by:</strong> ${lastUser || "Unknown"}
                        `;

        container.appendChild(editedRow);
    }

    // Attach popup DOM to Leaflet layer
    layer.bindPopup(container);
}
