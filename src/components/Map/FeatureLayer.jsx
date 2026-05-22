import { GeoJSON } from 'react-leaflet'
import { timeAgo } from '../../utils/timeAgo'
import L from "leaflet";

export default function FeatureLayer({ features }) {
    const exclude = new Set([
        "type",
        "id",
        "timestamp",
        "version",
        "changeset",
        "user",
        "uid",
    ]);

    var pinIcon = L.icon({
        iconUrl: './assets/pins/pinGreen.svg',
        iconSize: [30, 30],
        iconAnchor: [15, 30],

        popupAnchor: [0, -30],
    })

    return (
        <GeoJSON
            data={features}
            pointToLayer={(feature, latlng) => {
                return L.marker(latlng, { icon: pinIcon });
            }}
            onEachFeature={(feature, layer) => {
                const props = feature.properties || {};
                const lastUser = props.user;
                const [featureType, osmID] = feature.id.split("/");
                const container = document.createElement("div");

                const title = document.createElement("div");
                const subtitle = document.createElement("div");

                title.innerHTML = `
                    <h2>
                        <a
                            href="https://www.openstreetmap.org/${featureType}/${osmID}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${featureType}: ${osmID} 
                        </a>
                    <h2>
                `;
                subtitle.innerHTML = `<h3>Tags</h3>`;

                container.appendChild(title);
                container.appendChild(subtitle);

                Object.entries(props)
                    .filter(([k]) => !exclude.has(k))
                    .forEach(([key, value]) => {
                        const row = document.createElement("div");
                        row.innerHTML = `<strong>${key}</strong>: ${value}`;
                        container.appendChild(row);
                    });
                if (props.timestamp) {
                    const formattedDate = new Date(props.timestamp).toLocaleDateString("en-GB");
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

                layer.bindPopup(container);
            }}
        />
    )
}