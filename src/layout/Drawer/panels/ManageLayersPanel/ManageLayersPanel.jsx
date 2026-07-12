import "./ManageLayersPanel.css"
import LayerItem from './LayerItem'
import { Ghost } from "lucide-react"

export default function ManageLayersPanel({
    featureLayers,
    toggleLayerVisibility,
    updateLayer,
    removeLayer,
    renameLayer
}) {

    const hasLayers = Object.keys(featureLayers).length > 0

    return (
        <div className="panel-body">

            {!hasLayers ? (
                <div className="empty-state">
                    <Ghost size={180}/>
                    <p>
                        No feature layers loaded
                    </p>
                </div>
            ) : (
                <LayerItem
                    featureLayers={featureLayers}
                    toggleLayerVisibility={toggleLayerVisibility}
                    updateLayer={updateLayer}
                    removeLayer={removeLayer}
                    renameLayer={renameLayer}
                />
            )}


        </div>
    );
}