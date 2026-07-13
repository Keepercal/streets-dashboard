import { useMemo } from "react";
import evaluateFeature from "../utils/evaluateFeatures";

/**
 * useMapFeatures
 * ------------
 * Fetches OSM map features for a selected boundary and filter.
 *
 * Includes:
 * - request deduplication via cache
 * - request cancellation
 * - GeoJSON conversion
 */
export default function useFilteredLayers(featureLayers, filters) {
    return useMemo(() => {
        const result = {};

        Object.entries(featureLayers).forEach(([key, layer]) => {
            if (!layer.geojson?.features) return;

            result[key] = {
                ...layer,
                geojson: {
                    ...layer.geojson,
                    features: layer.geojson.features.map(feature => ({
                        ...feature,
                        _matchesFilters: evaluateFeature(feature, filters)
                    })),
                },
            };
        });

        return result

    }, [featureLayers, filters]);
}