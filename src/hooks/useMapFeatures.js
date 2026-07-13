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

    /* Status popup handling */
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    /* Cacheing */
    const requestId = useRef(0);
    const cache = useRef(new Map());

    /* Flags */
    const [failedFeatureKey, setFailedFeatureKey] = useState(null); // cleanup 

    /* Remove all features off map */
    const clearFeatures = () => {
        console.log('[DEBUG] clearing all map features');
        setFeatureLayers({});

        setError(null);
        setStatus("idle");
    };

    /* Remove a single feature */
    const removeLayer = (layerID) => {
        console.log('[DEBUG] removing feature:', {layerID});
        setFeatureLayers(prev => {
            const next = { ...prev };

            delete next[layerID];

            return next;
        });

        setError(null);
        setStatus("idle");
    }

    /* Show or hide features on the map */
    const toggleLayerVisibility = (layerID) => {
        console.log('[DEBUG] toggleLayerVisibility ENTER:', layerID);
        setFeatureLayers(prev => {
            const layer = prev[layerID];

            if (!layer) return prev;

            return{
                ...prev,
                [layerID]: {
                    ...prev[layerID],
                    visible: !prev[layerID].visible
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

    /* Create label for each layer with an indicator for if it's a duplicate */
    const createLayerLabel = (layers, featureKey, featureLabel) => {
            const count = Object.values(layers)
                .filter(layer => layer.sourceKey === featureKey)
                .length;

            return count === 0
                ? featureLabel
                : `${featureLabel} (${count + 1})`;
        }
    
    /* Array indicating what features are in the cache */
    // Used in the UI to indicate cached features
    const getCachedFeatures = () => {
        return Array.from(cache.current.values())
            .map(layer => layer.sourceKey)
    }

    /* Clear cache */
    // Used when loading a new boundary, data isn't left over in the cache
    const clearCache = () => { 
        cache.current.clear();
    }

    /* Loads features by calling Overpass API */
    const loadFeatures = async ({
        featureKey,
        boundaryKey,
        featureTag,
        featureValue,
        featureType,
        featureLabel,
    }) => {
        const layerID = crypto.randomUUID();
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

            // Load features from cache
            setFeatureLayers(prev => {
                const label = createLayerLabel(
                    prev,
                    cached.sourceKey,
                    featureLabel
                );
                
                return {
                    ...prev,
                    [layerID]: {
                        sourceKey: cached.sourceKey,
                        label,
                        data: cached.data,
                        geojson: cached.geojson,
                        colour: cached.colour,
                        visible: cached.visible,
                        filters: cached.filters,
                    }
                };
            });

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

            const geojson = osmtogeojson(result, { meta: true }); // Convert to geoJSON

            cache.current.set(cacheKey, {
                sourceKey: featureKey,
                data: result,
                geojson,
                label: featureLabel,
                colour,
                visible: true,
                filters: []
            });

            setFeatureLayers(prev => {
                const label = createLayerLabel(
                    prev,
                    featureKey,
                    featureLabel
                );
                
                return {
                    ...prev,
                    [layerID]: {
                        sourceKey: featureKey,
                        label,
                        data: result,
                        geojson,
                        colour,
                        visible: true,
                        filters: []
                    }
                };
            });

            setStatus("success");
        } catch (err) {
            if (currentId !== requestId.current) return;

            setFailedFeatureKey(featureKey) // pass back the feature that failed to load

            setError(err);
            setStatus("error");
        }
    };

    /* Layer inspection and updating */
    const updateLayer = (layerID, changes) => {
        setFeatureLayers(prev => ({
            ...prev,
            [layerID]: {
                ...prev[layerID],
                ...changes
            }
        }));
    };

    return {
        featureLayers,
        loadFeatures,
        clearFeatures,
        removeLayer,
        toggleLayerVisibility,
        updateLayer,
        failedFeatureKey,
        getCachedFeatures,
        clearCache,
        status,
        error,
    };
}