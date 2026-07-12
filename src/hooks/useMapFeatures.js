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

    /* Cacheing */
    const requestId = useRef(0);
    const cache = useRef(new Map());

    const [failedFeatureKey, setFailedFeatureKey] = useState(null); // cleanup 

    /* Remove all features off map */
    const clearFeatures = () => {
        console.log('[DEBUG] clearing all map features');
        setFeatureLayers({});

        setError(null);
        setStatus("idle");
    };

    /* Remove a single feature */
    const removeFeature = (featureKey) => {
        console.log('[DEBUG] removing feature:', featureKey);
        setFeatureLayers(prev => {
            const next = { ...prev };

            delete next[featureKey];

            return next;
        });

        setError(null);
        setStatus("idle");
    }

    /* Show or hide features on the map */
    const toggleFeatureVisibility = (featureKey) => {
        console.log('[DEBUG] toggleFeatureVisibility ENTER:', featureKey);
        setFeatureLayers(prev => {
            const layer = prev[featureKey];

            if (!layer) return prev;

            return{
                ...prev,
                [featureKey]: {
                    ...prev[featureKey],
                    visible: !prev[featureKey].visible
                }
            }
        })
    }

    /* Generate a colour for feature data, colour will be consistent across projects */
    function getLayerColour(key) {
        let hash = 0;

        for (let i = 0; i < key.length; i++) {
            hash = key.charCodeAt(i) + ((hash << 5) - hash);
        }

        const colour = (hash & 0x00FFFFFF)
            .toString(16)
            .padStart(6, "0");

        return `#${colour}`;
    }

    /* Loads features by calling Overpass API */
    const loadFeatures = async (
        featureKey,
        selectedBoundaryKey,
        featureTag,
        featureValue,
        featureType,
        featureLabel,
    ) => {
        const boundaryKey = selectedBoundaryKey; // current boundary
        const colour = getLayerColour(featureKey);

        const currentId = ++requestId.current;

        if (featureValue === null) {
            setStatus("idle");
            return;
        }

        const cacheKey = JSON.stringify([ // store results in cache
            boundaryKey,
            featureTag,
            featureValue,
            featureType,
            featureLabel,
        ]);

        if (cache.current.has(cacheKey)) { // check cache for stored features
            const cached = cache.current.get(cacheKey);

            // Cache load
            setFeatureLayers(prev => ({
                ...prev,
                [featureKey]: {
                    data: cached.data,
                    geojson: cached.geojson,
                    label: cached.label,
                    colour: cached.colour,
                    visible: cached.visible
                }
            }))

            setStatus("success");

            return;
        }

        setFeatureLayers(prev => {
            const next = { ...prev };
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
                featureLabel,
            );

            if (currentId !== requestId.current) return;

            console.log(result)

            const geojson = osmtogeojson(result, { meta: true }); // Convert to geoJSON

            cache.current.set(cacheKey, {
                data: result,
                geojson,
                label: featureLabel,
                colour,
                visible: true,
            });

            setFeatureLayers(prev => ({
                ...prev,
                [featureKey]: {
                    data: result,
                    geojson,
                    label: featureLabel,
                    colour,
                    visible: true,
                }
            }))

            setStatus("success");
        } catch (err) {
            if (currentId !== requestId.current) return;

            setFeatureLayers(prev => { // on err
                const next = { ...prev };
                delete next[featureKey];
                return next;
            })

            setFailedFeatureKey(featureKey) // pass back the feature that failed to load

            setError(err);
            setStatus("error");
        }
    };

    /* Layer inspection and updating */
    const updateLayer = (featureKey, changes) => {
        setFeatureLayers(prev => ({
            ...prev,
            [featureKey]: {
                ...prev[featureKey],
                ...changes
            }
        }));
    };

    return {
        featureLayers,
        loadFeatures,
        clearFeatures,
        removeFeature,
        toggleFeatureVisibility,
        updateLayer,
        failedFeatureKey,
        status,
        error,
    };
}