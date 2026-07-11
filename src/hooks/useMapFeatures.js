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
    const [featureLayers, setFeatureLayers] = useState({});

    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    const requestId = useRef(0);
    const cache = useRef(new Map());

    const [failedFeatureKey, setFailedFeatureKey] = useState(null);

    const clearFeatures = () => {
        setFeatureLayers({});

        setError(null);
        setStatus("idle");
    };

    const removeFeature = (featureKey) => {
        setFeatureLayers(prev => {
            const next = { ...prev };

            delete next[featureKey];

            return next;
        });

        setError(null);
        setStatus("idle");
    }

    const loadFeatures = async (
        featureKey,
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

            // Cache load
            setFeatureLayers(prev => ({
                ...prev,
                [featureKey]: {
                    data: cached.data,
                    geojson: cached.geojson
                }
            }))

            setStatus("success");

            return;
        }

        setFeatureLayers(prev =>{
                const next = {...prev};
                delete next[featureKey];
                return next;
        });

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
                data: result,
                geojson,
            });

            setFeatureLayers(prev => ({
                ...prev,
                [featureKey]: {
                    data: result,
                    geojson
                }
            }))

            setStatus("success");
        } catch (err) {
            if (currentId !== requestId.current) return;

            setFeatureLayers(prev =>{ // on err
                const next = {...prev};
                delete next[featureKey];
                return next;
            })

            setFailedFeatureKey(featureKey)
            
            setError(err);
            setStatus("error");
        }
    };

    return {
        featureLayers,
        loadFeatures,
        clearFeatures,
        removeFeature,
        failedFeatureKey,
        status,
        error,
    };
}