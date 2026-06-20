// Creates a new feature point to be placed on the map
// Feature position is derived from Overpass feature's metadata
import { GeoJSON } from 'react-leaflet'
import L from "leaflet";
import bindFeaturePopup from '../utils/bindFeaturePopup'
import { stylePolygon, createFeatureMarker } from '../utils/featureRendering'

export default function FeatureLayer({ features, zoom }) {

    const overviewFeatures = {
        type: "FeatureCollection",
        features: features.features
            .filter(f => f.geometry?.type !== "Point")
            .map(f => {
                const layer = L.geoJSON(f);
                const centre = layer.getBounds().getCenter(); // Store the centre of the polygon

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

    // Fields not displayed in the popup
    const exclude = new Set([
        "type",
        "id",
        "timestamp",
        "version",
        "changeset",
        "user",
        "uid",
    ]);

    return (
        <>
            <GeoJSON
                // Forces re-render when filter match state changes on features
                key={JSON.stringify(features?.features?.map(f => f._matchesFilters))}

                data={features}
                style={stylePolygon} // Styles polygons based on the time ago they were edited
                pointToLayer={createFeatureMarker} // Converts each GeoJSON point into a Leaflet marker

                onEachFeature={(feature, layer) => { // Create popup content for each feature
                    bindFeaturePopup(feature, layer, exclude);
                }}
            />

            {zoom < 15 && (
                <GeoJSON // Show marker on polygon if user zooms out
                    data={overviewFeatures}
                    pointToLayer={createFeatureMarker} // Converts each GeoJSON point into a Leaflet marker
                    onEachFeature={(feature, layer) => {
                        bindFeaturePopup(feature, layer, exclude);
                    }}
                />
            )}
        </>
    );
}