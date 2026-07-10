import './ExportPanel.css';
import Popup from '../Popup'

import ExportButton from './ExportButton'

/**
 * Export Panel
 * ----------------
 * Panel for exporting loaded features to various formats:
 */
export default function ExportPopup({ onClose, featureData }) {
    return (
        <Popup
            title="Export"
            onClose={onClose}
        >

            <div className="export-panel-btns">
                <ExportButton
                    featureData={featureData}
                    format="geojson"
                />
                <ExportButton
                    featureData={featureData}
                    format="kml"
                />
                <ExportButton
                    featureData={featureData}
                    format="gpx"
                />
            </div>
        </Popup>
    );
}