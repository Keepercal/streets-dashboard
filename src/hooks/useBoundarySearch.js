import { useState, useRef } from "react";
import searchBoundaries from "../services/nominatim/searchBoundaries"

/**
 * useSearchBoundary
 * -----------
 * Fetches list of OSM boundaries data from Nominatim.
 *
 * Handles:
 * - loading state
 * - request cancellation (via request id)
 * - resetting state
 */
export default function useBoundarySearch(){
    const [boundaryResults, setBoundaryResults] = useState([])
    const requestId = useRef(0);

    const clearBoundaryResults = () => {
        setBoundaryResults([]);
    }

    const loadBoundaryResults = async (boundaryName) => {
        setBoundaryResults(null)

        console.log('[DEBUG] loadBoundaryResults ENTER:',{
            boundaryName
        })

        const currentId = ++requestId.current;

        if (boundaryName === 'none'){
            return
        }

        try{
            const result = await searchBoundaries(boundaryName)

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
        loadBoundaryResults,
        clearBoundaryResults
    }
}