import './ExportModal.css';
import Modal from '../Modal'

import ExportButton from './ExportButton/ExportButton'

/**
 * Export Panel
 * ----------------
 * Panel for exporting loaded features to various formats:
 */
export default function ExportModal({ onClose, featureLayers }) {

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
        <Modal
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
        </Modal>
    );
}