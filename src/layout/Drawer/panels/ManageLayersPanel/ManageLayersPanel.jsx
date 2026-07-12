import "./ManageLayersPanel.css"
import LayerItem from './LayerItem'
import { Ghost } from "lucide-react"

export default function ManageLayersPanel({
    featureLayers,
    toggleFeatureVisibility,
    updateLayer,
    removeFeature,
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
                    toggleFeatureVisibility={toggleFeatureVisibility}
                    updateLayer={updateLayer}
                    removeFeature={removeFeature}
                    renameLayer={renameLayer}
                />
            )}


        </div>
    );
}