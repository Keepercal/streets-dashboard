import "./FeatureCount.css";

const FeatureCount = (features) => {
    let nodeCount = 0;
    let wayCount = 0;

    features?.features?.elements?.forEach(feature => {
        if(feature.type === "node"){
            nodeCount++
        } else if(feature.type === "way"){
            wayCount++
        }
    })

    return (
        <div className="feature-count">
            <div className="feature-count-content">
                <div className="feature-count-item">
                    <p>nodes: {nodeCount} ways: {wayCount}</p>
                </div>
            </div>
        </div>
    );
};

export default FeatureCount;
