import { useState, useRef } from "react";
import osmtogeojson from "osmtogeojson";

import { fetchMapFeature } from "../services/overpass/overpass";

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
export default function useMapFeatures() {
    const [featureData, setFeatureData] = useState(null);
    const [featureGeojson, setFeatureGeojson] = useState(null);

    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    const requestId = useRef(0);
    const cache = useRef(new Map());

    const clearFeatures = () => {
        setFeatureData(null);
        setFeatureGeojson(null);

        setError(null);
        setStatus("idle");
    };

    const loadFeatures = async (
        selectedBoundaryKey,
        featureTag,
        featureValue,
        featureType
    ) => {
        const boundaryKey = selectedBoundaryKey;

        const currentId = ++requestId.current;

        if (featureValue === null) {
            setStatus("idle");
            return;
        }

        const cacheKey = JSON.stringify([ // Store results in cache
            boundaryKey,
            featureTag,
            featureValue,
            featureType,
        ]);

        if (cache.current.has(cacheKey)) { // Check cache for stored features
            const cached = cache.current.get(cacheKey);

            setFeatureData(cached.featureData);
            setFeatureGeojson(cached.featureGeojson);
            setStatus("success");

            return;
        }

        setFeatureData(null);
        setFeatureGeojson(null);

        setError(null);
        setStatus("loading");

        try {
            const result = await fetchMapFeature( // Fetch map feature from Overpass API
                boundaryKey,
                featureTag,
                featureValue,
                featureType,
            );

            if (currentId !== requestId.current) return;

            console.log(result)

            const geojson = osmtogeojson(result, { meta: true }); // Convert to geoJSON

            cache.current.set(cacheKey, {
                featureData: result,
                featureGeojson: geojson,
            });

            setFeatureData(result);
            setFeatureGeojson(geojson);

            setStatus("success");
        } catch (err) {
            if (currentId !== requestId.current) return;

            setFeatureData(null);
            setFeatureGeojson(null);
            
            setError(err);
            setStatus("error");
        }
    };

    return {
        featureData,
        featureGeojson,
        loadFeatures,
        clearFeatures,
        status,
        error,
    };
}