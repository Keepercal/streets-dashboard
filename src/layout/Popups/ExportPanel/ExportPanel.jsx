import './ExportPanel.css';
import Popup from '../Popup'

/**
 * Export Panel
 * ----------------
 * Panel for exporting loaded features to various formats:
 */
export default function ExportPopup({ onClose }) {
    return (
        <Popup
            title="Export"
            onClose={onClose}
        >
            <p>
                Choose export options:
            </p>

            <button>
                Export GeoJSON
            </button>
        </Popup>
    );
}