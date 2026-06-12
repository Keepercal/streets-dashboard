async function callOverpass(query){
    console.log("ENTER callOverpass")
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    console.log(query)

    const res = await fetch(url);
    console.log("HTTP Status", res.status)

    return res;
}

// Fetch the boundary from Overpass
export async function fetchBoundary(boundaryKey, boundaryType, boundaryName){
    try{
        console.info("ENTER fetchBoundary", {boundaryKey})
        if (!boundaryKey || boundaryKey === 'none') return null;

        console.log(boundaryName)

        /*const query = `
            [out:json][timeout:60];
            relation["boundary"="${boundaryType}"]["name"="${boundaryName}"];
            out geom meta;
        `;*/

        const query = `
            [out:json][timeout:60];
            relation["name"="${boundaryName}"];
            out geom meta;
        `;

        const res = await callOverpass(query)

        if (res.status === 504){ // If HTTP 504, call function again
            console.warn(`fetchBoundary returned ${res.status}, retrying...`)
            return fetchBoundary(boundaryKey, boundaryType, boundaryName);
        }

        if (!res.ok && res.status !== 504){ // Any other type of HTTP error, throw error to user
            console.info("EXIT fetchBoundary", {boundaryKey});
            if (res.status === 429){
                throw new Error(
                    `HTTP Error: ${res.status} (${res.statusText}), try selecting the boundary again or wait a minute before selecting again`
                ); 
            } else{
                throw new Error(
                    `HTTP Error: ${res.status} (${res.statusText}), try selecting the boundary again`
                ); 
            }
            
        }

        const data = await res.json();
        console.log(data);

        if(!data?.elements?.length){ // Throw error if Overpass API returns empty object
            throw new Error(`Overpass returned an empty result.`)
        } else {
            console.clear()
            console.log(`success! recieved HTTP status ${res.status} (OK)`)
            console.log("Boundary data:", data)

            return data;
        }
    }catch(err){
        console.error("fetchBoundary failed:", err);
        throw err;
    }
}

export async function fetchMapFeature(boundaryKey, featureTag, featureValue, featureType){
    try{
        console.log("ENTER fetchMapFeature", { boundaryKey, featureTag, featureValue, featureType })
        if(!boundaryKey || boundaryKey === 'none') return null;

        // Tags for ward boundaries have been changed
        /*const query = `
            [out:json][timeout:60];

            relation
                ["boundary"="political"]
                ["name"~"${boundaryName}", i]->.rels;
            .rels map_to_area -> .area;

            ${featureType}(area.area)["${featureTag}"="${featureValue}"];

            out tags geom meta;
            `;*/

            const query = `
                [out:json][timeout:60];

                relation
                    ["name"~"${boundaryKey}", i]->.rels;
                .rels map_to_area -> .area;

                ${featureType}(area.area)["${featureTag}"="${featureValue}"];

                out tags geom meta;
                `;

        const res = await callOverpass(query);

        if (res.status === 504){
            console.warn(`fetchMapFeature returned ${res.status}, retrying...`)
            return fetchMapFeature(boundaryKey, featureTag, featureValue, featureType);
        }

        if (!res.ok && res.status !== 504){
            console.info("EXIT fetchMapFeature", {boundaryKey});
            throw new Error(
                `HTTP Error: ${res.status} (${res.statusText}), try selecting the feature again`
            );
        }

        const data = await res.json();

        if(!data?.elements?.length){
            console.log("Feature data:", data)
            throw new Error(`Overpass API returned an empty result`)
        }else{
            console.clear()
            console.log(`success! recieved HTTP status ${res.status}, clearing console...`)
            console.log("Feature data:", data)

            return data;
        }

    } catch(err){
        console.error("fetchMapFeature failed:", err)
        throw err;
    }

}