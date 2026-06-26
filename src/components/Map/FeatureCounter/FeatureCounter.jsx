import "./FeatureCounter.css";

/**
 * FeatureCount
 * ------------
 * Displays a summary count of GeoJSON feature types:
 * - nodes
 * - ways
 * - relations
 *
 * This component expects a GeoJSON-like structure where:
 * features.features.elements contains an array of elements with a `type` field.
 */
const FeatureCounter = ({ features }) => {
    // Counters for OSM-style feature types
    let nodeCount = 0;
    let wayCount = 0;
    let relationCount = 0;

    // Safely iterate through feature elements and classify by type
    features?.features?.elements?.forEach(feature => {
        switch (feature.type) {
            case "node":
                nodeCount++;
                break;
            case "way":
                wayCount++;
                break;
            case "relation":
                relationCount++;
                break;
            default:
                break;
        }
    });

    return (
        <div className="feature-count">
            <div className="feature-count-content">
                <div className="feature-count-item">
                    <p>
                        nodes: {nodeCount}, ways: {wayCount}, relations: {relationCount}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeatureCounter;