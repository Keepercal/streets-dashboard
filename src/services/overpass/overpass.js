const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

/**
 * callOverpass
 * ------------
 * Executes a raw Overpass API query and returns the HTTP response.
 *
 * Handles only transport-level concerns (fetch + status logging).
 */
async function callOverpass(query) {
    console.log("[DEBUG] callOverpass ENTER with query:", query)
    const url = `${OVERPASS_URL}?data=${encodeURIComponent(query)}`;

    const res = await fetch(url);

    return res;
}

/**
 * handleOverpassResponse
 * ----------------------
 * Centralised response handler for Overpass API calls.
 *
 * - Handles retries for 504 gateway timeouts
 * - Throws consistent errors for HTTP failures
 * - Validates payload shape
 */
async function handleOverpassResponse(res, retryFn) {
    if (res.status === 504) {
        return retryFn();
    }

    if (!res.ok) {
        if (res.status === 429) {
            throw new Error(
                `HTTP ${res.status}: Too Many Requests - wait before retrying`
            );
        }

        throw new Error(
            `HTTP ${res.status} (${res.statusText})`
        );
    }

    const data = await res.json();

    if (!data?.elements?.length) {
        throw new Error("Overpass returned an empty result");
    }

    console.log("[DEBUG] Overpass API returned a result", data);

    return data;
}

/**
 * fetchBoundary
 * -------------
 * Fetches a boundary relation from Overpass by name.
 */
export async function fetchBoundary(boundaryID, boundaryType) {
    if (!boundaryID || boundaryID === "none") return null;

    console.log('[DEBUG] fetchBoundary ENTER:', {
        boundaryID, boundaryType
    })

    let query;

    query = `
        [out:json][timeout:60];
        relation(${boundaryID});
        out geom meta;
    `;

    const res = await callOverpass(query);

    return handleOverpassResponse(res, () =>
        fetchBoundary(boundaryID, boundaryType)
    );
}

/**
 * fetchMapFeature
 * ---------------
 * Fetches OSM features inside a boundary area using tag filters.
 */
export async function fetchMapFeature(
    boundaryID,
    featureTag,
    featureValue,
    featureType
) {
    if (!boundaryID || boundaryID === "none") return null;

    console.log('[DEBUG] ENTER fetchFeatures:', {
        boundaryID, featureTag, featureValue, featureType
    })

    const query = `
        [out:json][timeout:60];

        relation(${boundaryID})->.rels;
        .rels map_to_area -> .area;

        nwr(area.area)["${featureTag}"="${featureValue}"];

        out tags geom meta;
    `;

    const res = await callOverpass(query);

    console.log(res)

    return handleOverpassResponse(res, () =>
        fetchMapFeature(boundaryID, featureTag, featureValue, featureType)
    );
}