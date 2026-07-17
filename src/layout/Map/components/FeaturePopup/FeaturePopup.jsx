import './FeaturePopup.css'

import { timeAgo } from "../../../../utils/timeAgo";
import getFeatureName from "../../utils/getFeatureName";
import getFeatureCoords from "../../utils/getFeatureCoords";
import { Pencil } from "lucide-react"

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
            <div className="feature-popup-header">
                {featureName && <h2>{featureName}</h2>}

                <div className="feature-popup-id">
                    <a
                        href={`https://www.openstreetmap.org/${featureType}/${osmID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Show in OpenStreetMap"
                    >
                        {featureType}: {osmID}
                    </a>

                    <a
                        className="edit-link"
                        href={`https://www.openstreetmap.org/edit?${featureType}=${osmID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Edit in OpenStreetMap"
                    >
                        <Pencil size={18} />
                    </a>
                </div>
            </div>

            <div className="feature-popup-content">
                <h3>Tags</h3>

                <div className="tags-table">
                    {Object.entries(props)
                        //.filter(([k]) => k !== "name" && !exclude.has(k)) // exclude metadata and name from tags
                        .filter(([k]) => !exclude.has(k)) // exclude metadata, include name
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([key, value]) => (
                            <div className="tag-row" key={key}>
                                <div className="tag-key">
                                    {key}
                                </div>
                                <div className="tag-value">
                                    {String(value)}
                                </div>
                            </div>
                        ))}
                </div>

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
                        {props.user ? (
                            <a
                                href={`https://www.openstreetmap.org/user/${props.user}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {props.user}
                            </a>
                        ) : (
                            "Unknown"
                        )}
                        <br />

                        <strong>Changeset:</strong>{" "}
                        {props.changeset ? (
                            <a
                                href={`https://www.openstreetmap.org/changeset/${props.changeset}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                #{props.changeset}
                            </a>
                        ) : (
                            "Unknown"
                        )}
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
        </div>
    );
}