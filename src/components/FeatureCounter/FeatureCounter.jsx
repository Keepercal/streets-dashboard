import "./FeatureCounter.css";

/**
 * FeatureCounter
 * ------------
 * Displays a summary count across all loaded feature layers.
 */
const FeatureCounter = ({ features }) => {

    console.log(features)

    let nodeCount = 0;
    let wayCount = 0;
    let relationCount = 0;

    Object.values(features || {}).forEach(layer => {

        layer.data?.elements?.forEach(feature => {

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

    });

    return (
        <div className="feature-count">
            <div className="feature-count-content">

                <div className="feature-count-item">
                    <p>
                        Nodes {nodeCount}
                    </p>

                    <p>
                        Ways {wayCount}
                    </p>

                    <p>
                        Relations {relationCount}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default FeatureCounter;