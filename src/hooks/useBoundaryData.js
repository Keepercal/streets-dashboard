import { useState, useRef } from "react";
import osmtogeojson from "osmtogeojson";

import { fetchBoundary } from "../services/overpass/overpass";

/**
 * useBoundaryData
 * -----------
 * Fetches and manages OSM boundary data and its GeoJSON conversion.
 *
 * Handles:
 * - loading boundary using a service from the Overpass API
 * - clearing boundaries
 * - resetting state
 * - exporting and restoring boundaries
 */
export default function useBoundary() {
    const [boundaryData, setBoundaryData] = useState(null);
    const [boundaryGeojson, setBoundaryGeojson] = useState(null);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    const requestId = useRef(0);

    /* Load boundary by fetching from Overpass API */
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

    /* Clear the current boundary */
    const clearBoundary = () => {
        setBoundaryData(null);
        setBoundaryGeojson(null);

        setStatus("idle");
        setError(null);
    };

    /* Export the boundary data as an object */
    function exportBoundary(){
        return{
            data: boundaryData,
            geojson: boundaryGeojson
        }
    }

    /* Restore a given boundary */
    function restoreBoundary(boundary){
        requestId.current++;

        if(!boundary){
            clearBoundary();
            return
        }

        setBoundaryData(boundary.data)
        setBoundaryGeojson(boundary.geojson)

        setStatus("success");
        setError(null);
    }

    return {
        boundaryData,
        boundaryGeojson,

        loadBoundary,
        clearBoundary,

        exportBoundary,
        restoreBoundary,

        status,
        error,
    };
}