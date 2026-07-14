import { useState, useRef } from "react";
import osmtogeojson from "osmtogeojson";

import { fetchBoundary } from "../services/overpass/overpass";

/**
 * useBoundaryData
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

    const loadBoundary = async (boundaryID, boundaryType, boundaryName) => {
        clearBoundary();

        console.log('[DEBUG] loadBoundary ENTER:', {
            boundaryID,
            boundaryType,
            boundaryName,
        })

        const currentId = ++requestId.current;

        if (boundaryID === "none") {
            console.error("[DEBUG] BoundaryID is empty:", boundaryID)
            return;
        }

        setStatus("loading");

        try {
            const result = await fetchBoundary( // Fetch boundary from Overpass API
                boundaryID,
                boundaryType,
            );

            if (currentId !== requestId.current) return;

            const geojson = osmtogeojson(result, { meta: true }); // Convert results to geoJSON

            setBoundaryData(result);
            setBoundaryGeojson(geojson);

            setStatus("success");
        } catch (err) {
            if (currentId !== requestId.current) return;

            console.error(err)

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