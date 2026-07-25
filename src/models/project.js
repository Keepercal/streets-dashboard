// Creates a default/empty object for a new project
export function createEmptyProject(){
    return{
        version: 1,

        name: "Untitled Project",

        settings: {
            basemap: "carto",
            displayMode: "default"
        },

        boundary: {
            selectedBoundaryKey: "none",
            data: null,
            geojson: null,
        },

        layers: []
    };
}