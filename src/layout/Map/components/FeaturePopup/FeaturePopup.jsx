import { timeAgo } from "../../../../utils/timeAgo";
import getFeatureName from "../../utils/getFeatureName";
import getFeatureCoords from "../../utils/getFeatureCoords";

export default function FeaturePopup({ feature, exclude }) {
    const props = feature.properties ?? {};

    /* OSM ID parsing */
    const [featureType, osmID] = (feature.id || "").split("/");

    const featureName = getFeatureName(feature);
    const { lat, lon } = getFeatureCoords(feature);

    const formattedDate = new Date(props.timestamp).toLocaleDateString("en-GB");
    const timeAgoText = timeAgo(props.timestamp);

    return (
        <div>
            {featureName && <h2>{featureName}</h2>}

            <h2>
                <a
                    href="https://www.openstreetmap.org/${featureType}/${osmID}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {featureType}: {osmID}
                </a>
            </h2>

            <h3>
                <a
                    href="https://www.openstreetmap.org/edit?${featureType}=${osmID}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Edit
                </a>
            </h3>

            <h3>Tags</h3>

            {Object.entries(props)
                .filter(([k]) => k !== "name" && !exclude.has(k))
                .map(([key, value]) => (
                    <div key={key}>
                        <strong>{key}</strong>: {String(value)}
                    </div>
                ))}

                

            {props.timestamp && (
                <div
                    style={{
                        marginTop: 8,
                        fontSize: 12,
                        opacity: 0.75
                    }}
                >
                    <strong>Last edited:</strong> {formattedDate} ({timeAgoText})
                    <br />
                    <strong>Last edited by:</strong>{" "}
                    {props.user ?? "Unknown"}
                </div>
            )}

            <h3>
                <a
                    href={`https://www.google.com/maps?q=${lat},${lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View in Google Maps
                </a>
            </h3>
        </div>
    );
}