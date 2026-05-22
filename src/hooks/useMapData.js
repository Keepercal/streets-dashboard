import osmtogeojson from 'osmtogeojson';
import { useState, useRef } from "react";
import { fetchBoundary, fetchMapFeature } from '../services/overpass';

// Fetch boundary from OSM
export function useBoundary() {
    const [boundaryData, setBoundaryData] = useState(null);
    const [boundaryGeojson, setBoundaryGeojson] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setErrorMessage] = useState(null);

    let currentRequest = useRef(0);

    const clearBoundary = () => {
        console.log("clearing all states relating to boundaries...");
        setBoundaryData(null);
        setBoundaryGeojson(null);
        setStatus("idle");
        setErrorMessage(null);

        console.log({ boundaryData, boundaryGeojson, status });
    };

    // When user clicks on a boundary option
    const loadBoundary = async (value, boundaryType, boundaryName) => {
        console.log("ENTER loadBoundary", { value, boundaryType, boundaryName });
        clearBoundary(); // Reset states
        const requestID = ++currentRequest.current;

        if (value == "none") {
            console.debug("null");
            setStatus("idle");
            return;
        }

        setStatus("loading");

        try {
            console.log("calling fetchBoundary", { value, boundaryType, boundaryName });
            const result = await fetchBoundary(value, boundaryType, boundaryName); // Fetching from Overpass API
            if (requestID !== currentRequest.current) return;

            const geojson = osmtogeojson(result, {meta: true}); // Convert to GeoJSON

            setBoundaryData(result);
            setBoundaryGeojson(geojson);
            setStatus("success");
        } catch (err) {
            if (requestID !== currentRequest.current) return;
            setBoundaryData(null);
            setBoundaryGeojson(null);
            setStatus("error");
            setErrorMessage(err);
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

// Fetch features from OSM
export function useMapFeature() {
    const [featureData, setFeatureData] = useState(null);
    const [featureGeojson, setFeatureGeojson] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setErrorMessage] = useState(null);

    let currentRequest = useRef(0);

    const clearFeatures = () => {
        console.log("ENTER clearFeatures");
        setFeatureData(null);
        setFeatureGeojson(null);
        setStatus("idle");
        setErrorMessage(null);

        console.log({ featureData, featureGeojson, status });
    };

    // When user clicks on a feature toggle
    const loadFeatures = async (boundaryName, featureTag, featureValue, featureType) => {
        console.log("ENTER loadFeatures", { boundaryName, featureTag, featureValue, featureType });
        clearFeatures();
        const requestID = ++currentRequest.current;

        // If null, hide the popup
        if (featureValue === null) {
            console.log("null");
            setStatus("idle");
            return;
        }

        // Show the loading popup
        setStatus("loading");

        try {
            console.log("calling fetchMapFeature", { boundaryName, featureTag, featureValue, featureType });
            const result = await fetchMapFeature(boundaryName, featureTag, featureValue, featureType); // Call function which interacts with Overpass API
            if (requestID !== currentRequest.current) return;

            const geojson = osmtogeojson(result, { meta: true }); // Convert the result to GeoJSON

            setFeatureData(result); // Store raw result
            setFeatureGeojson(geojson); // Store result in GeoJSON
            setStatus("success"); // Hide popup
        } catch (err) {
            if (requestID !== currentRequest.current) return;
            setFeatureData(null);
            setFeatureGeojson(null);
            setStatus("error");
            setErrorMessage(err);
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
