import './ExportModal.css';
import { useState, useMemo } from "react";

import buildExportGeoJSON from './buildExportGeoJSON';

import Modal from '../Modal'
import ExportButton from './components/ExportButton/ExportButton'
import RadioItem from '../../../components/RadioItem/RadioItem';
import CheckboxItem from '../../../components/CheckboxItem/CheckboxItem';

/**
 * Export Modal
 * ----------------
 * Modal for exporting loaded features to various formats:
 */
export default function ExportModal({ onClose, featureLayers }) {

    console.log("[DEBUG] ExportModal ENTER: ",featureLayers)

    const [featureScope, setFeatureScope] = useState("all");
    const [layerScope, setLayerScope] = useState("all");

    const [selectedLayers, setSelectedLayers] = useState(
        Object.keys(featureLayers)
    );

    const toggleLayer = (layerID) => {
        setSelectedLayers(prev =>
            prev.includes(layerID)
                ? prev.filter(id => id !== layerID)
                : [...prev, layerID]
        );
    };

    const handleLayerScopeChange = (scope) => {
        setLayerScope(scope)

        if (scope === "all") {
            setSelectedLayers(
                Object.keys(featureLayers)
            );
        }

        if (scope === "selected"){
            setSelectedLayers(
                Object.keys(featureLayers)
            )
        }
    }

    const exportData = useMemo(() => 
        buildExportGeoJSON({
        featureLayers,
        layerScope,
        featureScope,
        selectedLayers
    }),
    [
        featureLayers,
        layerScope,
        featureScope,
        selectedLayers
    ]);

    return (
        <Modal
            title="Export"
            onClose={onClose}
        >   
            <section className="export-section">
                <h3>Features</h3>

                <RadioItem
                    className="export-radio"
                    label="All Only"
                    value="all"
                    selected={featureScope}
                    onChange={setFeatureScope}
                />

                <RadioItem
                    className="export-radio"
                    label="Filtered Features Only"
                    value="filtered"
                    selected={featureScope}
                    onChange={setFeatureScope}
                />
            </section>

            <section className="export-section">
                <h3>Layers</h3>

                <div className="export-options">
                    <RadioItem
                        className="export-radio"
                        label="All Layers"
                        value="all"
                        selected={layerScope}
                        onChange={handleLayerScopeChange}
                    />

                    <RadioItem
                        className="export-radio"
                        label="Visible Layers Only"
                        value="visible"
                        selected={layerScope}
                        onChange={handleLayerScopeChange}
                    />

                    <RadioItem
                        className="export-radio"
                        label="Select Layers"
                        value="selected"
                        selected={layerScope}
                        onChange={handleLayerScopeChange}
                    />

                    <section className="export-section">
                        <div className="layer-selection">
                            <h3>Available Layers</h3>

                            {Object.entries(featureLayers).map(([layerID, layer]) => (
                                <CheckboxItem
                                    className="export-checkbox"
                                    key={layerID}
                                    label={layer.displayName ?? layer.label ?? layer.sourceKey}
                                    checked={layerScope !== "selected" ? false : selectedLayers.includes(layerID)}
                                    indeterminate={layerScope !== "selected" }
                                    disabled={layerScope !== "selected"}
                                    onChange={() => toggleLayer(layerID)}
                                />
                            ))}
                        </div>
                    </section>

                </div>
            </section>

            <section className="export-section">
                <h3>Export Format</h3>

                <div className="export-format-btns">
                    {["geojson", "kml", "gpx"].map(format => (
                        <ExportButton
                            key={format}
                            geojson={exportData}
                            format={format}
                        />
                    ))}
                </div>
            </section>



        </Modal>
    );
}