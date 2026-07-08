const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

/**
 * callOverpass
 * ------------
 * Executes a raw Overpass API query and returns the HTTP response.
 *
 * Handles only transport-level concerns (fetch + status logging).
 */
async function callOverpass(query) {
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

    return data;
}

/**
 * fetchBoundary
 * -------------
 * Fetches a boundary relation from Overpass by name.
 */
export async function fetchBoundary(boundaryKey, boundaryType, boundaryName, boundaryID) {
    if (!boundaryKey || boundaryKey === "none") return null;

    console.log('[DEBUG] fetchBoundary ENTER:', {
        boundaryKey, boundaryType, boundaryName, boundaryID
    })

    let query;

    query = `
        [out:json][timeout:60];
        relation(${boundaryKey});
        out geom meta;
    `;

    console.log(query)

    const res = await callOverpass(query);

    return handleOverpassResponse(res, () =>
        fetchBoundary(boundaryKey, boundaryType, boundaryName)
    );
}

/**
 * fetchMapFeature
 * ---------------
 * Fetches OSM features inside a boundary area using tag filters.
 */
export async function fetchMapFeature(
    boundaryKey,
    featureTag,
    featureValue,
    featureType
) {
    if (!boundaryKey || boundaryKey === "none") return null;

    console.log('[DEBUG] ENTER fetchFeatures:', {
        boundaryKey, featureTag, featureValue, featureType
    })

    const query = `
        [out:json][timeout:60];

        relation(${boundaryKey})->.rels;
        .rels map_to_area -> .area;

        ${featureType}(area.area)["${featureTag}"="${featureValue}"];

        out tags geom meta;
    `;

    console.log(query)

    const res = await callOverpass(query);

    console.log(res)

    return handleOverpassResponse(res, () =>
        fetchMapFeature(boundaryKey, featureTag, featureValue, featureType)
    );
}