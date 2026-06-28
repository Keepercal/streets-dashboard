import osmtogeojson from "osmtogeojson";
import { useState, useRef } from "react";
import { fetchBoundary, fetchMapFeature } from "../services/overpass";
import fetchBoundaries from "../services/nominatim"

/* Maps */
import { BOUNDARY_MAP } from '../config/osmBoundaryMap.js';

export function useSearchBoundaries(){
    const [boundaryResults, setBoundaryResults] = useState([])
    const requestId = useRef(0);

    const searchBoundaries = async (boundaryName) => {
        setBoundaryResults(null)

        console.log('[DEBUG] searchBoundaries ENTER:',{
            boundaryName
        })

        const currentId = ++requestId.current;

        if (boundaryName === 'none'){
            return
        }

        try{
            const result = await fetchBoundaries(boundaryName)

            if (currentId !== requestId.current) return;
            
            setBoundaryResults(result)

            console.log("Nominatim API return a result(s):", {
                result
            })
        } catch (err){
            if (currentId !== requestId.current) return;
            setBoundaryResults([])
            console.error(err)
        }
    };

    return{
        boundaryResults,
        searchBoundaries
    }
}

/**
 * useBoundary
 * -----------
 * Fetches and manages OSM boundary data and its GeoJSON conversion.
 *
 * Handles:
 * - loading state
 * - request cancellation (via request id)
 * - resetting state
 */
export function useBoundary() {
    const [boundaryData, setBoundaryData] = useState(null);
    const [boundaryGeojson, setBoundaryGeojson] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    const requestId = useRef(0);

    const clearBoundary = () => {
        setBoundaryData(null);
        setBoundaryGeojson(null);
        setStatus("idle");
        setError(null);
    };

    const loadBoundary = async (boundaryKey, boundaryType, boundaryName, boundaryID) => {
        clearBoundary();

        console.log('[DEBUG] loadBoundary ENTER:', {
            boundaryKey,
            boundaryType,
            boundaryName,
            boundaryID,
        })

        const currentId = ++requestId.current;

        if (boundaryKey === "none") {
            return;
        }

        setStatus("loading");

        try {
            const result = await fetchBoundary(
                boundaryKey,
                boundaryType,
                boundaryName,
                boundaryID
            );

            if (currentId !== requestId.current) return;

            const geojson = osmtogeojson(result, { meta: true });

            setBoundaryData(result);
            setBoundaryGeojson(geojson);
            setStatus("success");
        } catch (err) {
            if (currentId !== requestId.current) return;

            setBoundaryData(null);
            setBoundaryGeojson(null);
            setStatus("error");
            setError(err);
        }
    };

    return {
        boundaryData,
        boundaryGeojson,
        clearBoundary,
        loadBoundary,
        status,
        error,
    };
}

/**
 * useMapFeature
 * ------------
 * Fetches OSM map features for a selected boundary and filter.
 *
 * Includes:
 * - request deduplication via cache
 * - request cancellation
 * - GeoJSON conversion
 */
export function useMapFeature() {
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
        selectedBoundary,
        featureTag,
        featureValue,
        featureType
    ) => {
        const boundaryKey = selectedBoundary;

        const currentId = ++requestId.current;

        if (featureValue === null) {
            setStatus("idle");
            return;
        }

        const cacheKey = JSON.stringify([
            boundaryKey,
            featureTag,
            featureValue,
            featureType,
        ]);

        if (cache.current.has(cacheKey)) {
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
            const result = await fetchMapFeature(
                boundaryKey,
                featureTag,
                featureValue,
                featureType,
            );

            if (currentId !== requestId.current) return;

            const geojson = osmtogeojson(result, { meta: true });

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