import { useState, useRef } from "react";
import osmtogeojson from "osmtogeojson";

import { fetchBoundary } from "../services/overpass/overpass";

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
export default function useBoundary() {
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
            const result = await fetchBoundary( // Fetch boundary from Overpass API
                boundaryKey,
                boundaryType,
                boundaryName,
                boundaryID
            );

            if (currentId !== requestId.current) return;

            const geojson = osmtogeojson(result, { meta: true }); // Convert results to geoJSON

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