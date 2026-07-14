import "./ManageLayersPanel.css"
import LayerItem from './LayerItem/LayerItem'
import { Ghost } from "lucide-react"

export default function ManageLayersPanel({
    featureLayers,
    toggleLayerVisibility,
    updateLayer,
    updateLayerFilters,
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
                Object.entries(featureLayers).map(([layerID, layer]) => (
                    <LayerItem
                        key={layerID}
                        
                        layerID={layerID}
                        layer={layer}
                    
                        toggleLayerVisibility={toggleLayerVisibility}
                        updateLayer={updateLayer}
                        updateLayerFilters={updateLayerFilters}
                        removeLayer={removeLayer}
                        renameLayer={renameLayer}
                    />
                ))
            )}


        </div>
    );
}