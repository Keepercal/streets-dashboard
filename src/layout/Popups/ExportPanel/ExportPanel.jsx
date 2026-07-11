import './ExportPanel.css';
import Popup from '../Popup'

import ExportButton from './ExportButton'

/**
 * Export Panel
 * ----------------
 * Panel for exporting loaded features to various formats:
 */
export default function ExportPanel({ onClose, featureLayers }) {

    const combinedFeatures = {
        type: "FeatureCollection",
        features: Object.entries(featureLayers)
            .flatMap(([layerKey, layer]) =>
                layer.geojson.features.map(feature => ({
                    ...feature,
                    properties: {
                        ...feature.properties,
                        _layer: layerKey
                    }
                }))
            )
    }

    return (
        <Popup
            title="Export"
            onClose={onClose}
        >

            <div className="export-panel-btns">
                <ExportButton
                    featureData={combinedFeatures}
                    format="geojson"
                />
                <ExportButton
                    featureData={combinedFeatures}
                    format="kml"
                />
                <ExportButton
                    featureData={combinedFeatures}
                    format="gpx"
                />
            </div>
        </Popup>
    );
}