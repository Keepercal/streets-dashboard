import osmtogeojson from "osmtogeojson";
import tokml from "tokml";
import GeoJsonToGpx from "@dwayneparton/geojson-to-gpx";

export type ExportFormat =
    | "geojson"
    | "kml"
    | "gpx";


export function convertOSM(
    osmData: any,
    format: ExportFormat
): string {

    const geojson = osmtogeojson(osmData);

    switch (format) {
        case "geojson":
            return JSON.stringify(
                geojson,
                null,
                2
            );

        case "kml":
            return tokml(geojson);

        case "gpx":
            return new XMLSerializer().serializeToString(
                GeoJsonToGpx(geojson)
            );

        default:
            throw new Error(
                `Unsupported format: ${format}`
            );
    }
}