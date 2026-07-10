// Creates a new feature point to be placed on the map
// Feature position is derived from Overpass feature's metadata
import { GeoJSON } from 'react-leaflet'
import L from "leaflet";

import bindFeaturePopup from '../utils/bindFeaturePopup'
import { createFeatureMarker, stylePolygon } from '../utils/featureRendering'

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
export default function FeatureLayer({ features, zoom, displayMode }) {
    if (!features?.features) return null;

    /**
     * Overview mode:
     * Converts polygon features into centroid points
     * so they can be displayed at low zoom levels.
     */
    const overviewFeatures = {
        type: "FeatureCollection",
        features: features.features
            .filter(f => 
                f.geometry?.type !== "Point" &&
                f.geometry?.type !== "LineString"
            )
            .map(f => {
                const bounds = L.geoJSON(f).getBounds();
                const centre = bounds.getCenter(); // Store the centre of the polygon

                return {
                    ...f,
                    geometry: {
                        type: "Point",
                        coordinates: [centre.lng, centre.lat]
                    }
                };
            })
    };

    /**
     * Attach popup content to each feature layer
     */
    const handleEachFeature = (feature, layer) => {
        bindFeaturePopup(feature, layer, EXCLUDE_KEYS);
    };

    const filterKey = JSON.stringify(
        features.features.map(f => f._matchesFilters)
    );

    return (
        <>
            <GeoJSON
                data={features}
                key={`features-${filterKey}-${displayMode}`} // Forces re-render when filter match state changes on features
                
                style={(feature) => stylePolygon(feature, displayMode)} // Styles polygons based on the time ago they were edited
                
                pointToLayer={(feature, latlng) =>
                    createFeatureMarker(feature, latlng, displayMode)
                } // Converts each GeoJSON point into a Leaflet marker

                onEachFeature={handleEachFeature}
            />

            {zoom < 15 && (
                <GeoJSON // Show marker on polygon if user zooms out
                    data={overviewFeatures}
                    key={`overview-${filterKey}-${displayMode}`}

                    pointToLayer={(feature, latlng) =>
                        createFeatureMarker(feature, latlng, displayMode)
                    } // Converts each GeoJSON point into a Leaflet marker

                    onEachFeature={handleEachFeature}
                />
            )}
        </>
    );
}