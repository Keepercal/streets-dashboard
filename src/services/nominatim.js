async function findBoundaries(boundaryName){
    const url =
    `https://nominatim.openstreetmap.org/search?` +
    new URLSearchParams({
        q: boundaryName,
        format: "jsonv2",
        limit: 10
    });

    const res = await fetch(url, {
        headers: {
            "Accept": "application/json"
        }
    });

    const data = await res.json();

    return data;
}

export default findBoundaries;