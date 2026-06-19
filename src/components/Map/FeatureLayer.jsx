// Creates a new feature point to be placed on the map
// Feature position is derived from Overpass feature's metadata

import { GeoJSON } from 'react-leaflet'
import { timeAgo } from '../../utils/timeAgo'
import L from "leaflet";

export default function FeatureLayer({ features }) {

    // Fields not displayed in the popup
    const exclude = new Set([
        "type",
        "id",
        "timestamp",
        "version",
        "changeset",
        "user",
        "uid",
    ]);

    // Marker icons based on feature recency
    var pinGreen = L.icon({
        iconUrl: './assets/pins/pinGreen.svg',
        iconSize: [30, 30],
        iconAnchor: [15, 30],

        popupAnchor: [0, -30],
    })

    var pinYellow = L.icon({
        iconUrl: './assets/pins/pinYellow.svg',
        iconSize: [30, 30],
        iconAnchor: [15, 30],

        popupAnchor: [0, -30],
    })

    var pinRed = L.icon({
        iconUrl: './assets/pins/pinRed.svg',
        iconSize: [30, 30],
        iconAnchor: [15, 30],

        popupAnchor: [0, -30],
    })

    return (
        <GeoJSON
            // Forces re-render when filter match state changes on features
            key={JSON.stringify(features?.features?.map(f => f._matchesFilters))}
            data={features}

            style={(feature) => {
                const match = feature._matchesFilters !== false;

                const timestamp = feature.properties?.timestamp;
                const YEAR = 365;
                const THREE_YEARS = 3 * 365;

                let color = "#D83F29"; // Default to red

                if (timestamp) {
                    const editedDate = new Date(timestamp);
                    const daysSinceEdit = (Date.now() - editedDate.getTime()) / (1000 * 60 * 60 * 24);

                    if (daysSinceEdit <= YEAR) { // Recent edit (< 1 year)
                        color = "#739D55";
                    } else if (daysSinceEdit <= THREE_YEARS) {
                        color = "#E0C055"; // Moderately old edit (~3 years)
                    }
                }

                if (!match) {
                    return {
                        color,
                        opacity: 0.15,
                        weight: 2,
                        fillOpacity: 0.05,
                    };
                }

                return {
                    color,
                    opacity: 1,
                    weight: 3,
                    fillOpacity: 0.2,
                };
            }}

            // Converts each GeoJSON point into a Leaflet marker
            pointToLayer={(feature, latlng) => {
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
            }}

            // Create popup content for each feature
            onEachFeature={(feature, layer) => {

                const props = feature.properties || {};
                const lastUser = props.user; // Last user to edit feature
                const geom = feature.geometry
                let lon, lat;

                if (!geom){ // Throw if the feature is missing geometry
                    console.error("Missing geometry", feature);
                    return;
                }

                if (geom.type === "Point"){ // If the feature is a Point (Node), update lon lat from array
                    [lon, lat] = geom.coordinates;
                }

                else if (geom.type === "LineString"){ // If the feature is a LineString, calculate the centre
                    // geometry is array of {lat, lon}
                    const coords = geom.coordinates;

                    const lons = coords.map(p => p[0]);
                    const lats = coords.map(p => p[1]);

                    lon = (Math.min(...lons) + Math.max(...lons)) / 2;
                    lat = (Math.min(...lats) + Math.max(...lats)) / 2;

                    console.log("way")
                } 
                
                else if (geom.type === "Polygon"){ // If the feature is a Polygon, calculate the centre
                    const ring = geom.coordinates[0]; // outer ring

                    const lons = ring.map(p => p[0]);
                    const lats = ring.map(p => p[1]);

                    lon = (Math.min(...lons) + Math.max(...lons)) / 2;
                    lat = (Math.min(...lats) + Math.max(...lats)) / 2;
                } 
                
                else if (geom.type === "MultiPolygon"){ // If the feature is a MultiPolygon, calculate the centre
                    const ring = geom.coordinates[0][0];

                    const lons = ring.map(p => p[0]);
                    const lats = ring.map(p => p[1]);

                    lon = (Math.min(...lons) + Math.max(...lons)) / 2;
                    lat = (Math.min(...lats) + Math.max(...lats)) / 2;
                } 
                
                else{
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
            }}
        />
    )
}