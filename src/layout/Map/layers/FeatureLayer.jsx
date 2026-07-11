// Creates a new feature point to be placed on the map
// Feature position is derived from Overpass feature's metadata
import { GeoJSON } from 'react-leaflet'
import L from "leaflet";
import React from "react";

import bindFeaturePopup from '../utils/bindFeaturePopup'
import { createFeatureMarker, stylePolygon } from '../utils/featureRendering'
import getLayerColour from "../../../utils/layerColours";

// Fields not displayed in the popup
const EXCLUDE_KEYS = new Set([
    "type",
    "id",
    "timestamp",
    "version",
    "changeset",
    "user",
    "uid",
]);

/**
 * FeatureLayer
 * ------------
 * Renders Overpass features on the map.
 *
 * Features:
 * - Displays polygons and points
 * - Converts polygons to centroid markers when zoomed out
 * - Applies dynamic styling based on filter state (_matchesFilters)
 * - Binds popup content to each feature
 */
export default function FeatureLayer({ featureLayers, zoom, displayMode }) {
    if (!featureLayers || Object.keys(featureLayers).length === 0){
        return null;
    };
    
    return (
        <>
            {Object.entries(featureLayers).map(([featureKey, layer]) => {
                
                const features = layer.geojson;

                const layerColour = getLayerColour(featureKey)

                if (!features?.features) return null;

                /*const featuresWithLayer = {
                    ...features,
                    features: features.features.map(feature => ({
                        ...feature,
                        properties: {
                            ...feature.properties,
                            _layer: featureKey
                        }
                    }))
                };*/

                const overviewFeatures = {
                    type: "FeatureCollection",
                    features: features.features
                        .filter(f =>
                            f.geometry?.type !== "Point" &&
                            f.geometry?.type !== "LineString"
                        )
                        .map(f =>{
                            const bounds = L.geoJSON(f).getBounds();
                            const centre = bounds.getCenter();

                            return {
                                ...f,
                                geometry: {
                                    type: "Point",
                                    coordinates: [
                                        centre.lng,
                                        centre.lat
                                    ]
                                }
                            };
                        })
                };

                const handleEachFeature = (feature, layer) => {
                    bindFeaturePopup(feature, layer, EXCLUDE_KEYS);
                };

                const filterKey = JSON.stringify(
                    features.features.map(f => f._matchesFilters)
                );

                return (
                    <React.Fragment key={featureKey}>

                        <GeoJSON
                            data={features}

                            key={`${featureKey}-${filterKey}-${displayMode}`}

                            style={(feature) =>
                                stylePolygon(
                                    feature, 
                                    displayMode,
                                    /*, featureKey,*/
                                    layerColour,
                                )
                            }

                            pointToLayer={(feature, latlng) =>
                                createFeatureMarker(
                                    feature,
                                    latlng,
                                    displayMode,
                                    //featureKey,
                                    layerColour
                                )
                            }

                            onEachFeature={handleEachFeature}
                        />

                        {zoom < 15 && (
                            <GeoJSON
                                data={overviewFeatures}

                                key={`${featureKey}-overview-${filterKey}-${displayMode}`}

                                pointToLayer={(feature, latlng) =>
                                    createFeatureMarker(
                                        feature,
                                        latlng,
                                        displayMode,
                                        //featureKey,
                                        layerColour
                                    )
                                }

                                onEachFeature={handleEachFeature}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </>
    );
}