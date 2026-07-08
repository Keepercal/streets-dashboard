import { convertOSM, type ExportFormat } from '../../../services/exportFormats';
import { downloadFile } from "../../../utils/downloadFile";


interface ExportButtonProps {
    featureData: any;
    format: ExportFormat;
    filename?: string;
}


export default function ExportButton({
    featureData,
    format,
    filename = "osm-export",
}: ExportButtonProps) {

    function handleExport() {

        const convertedData = convertOSM(
            featureData,
            format
        );


        const fileSettings: Record<
            ExportFormat,
            {
                extension: string;
                mime: string;
            }
        > = {
            geojson: {
                extension: "geojson",
                mime: "application/geo+json",
            },

            kml: {
                extension: "kml",
                mime: "application/vnd.google-earth.kml+xml",
            },

            gpx: {
                extension: "gpx",
                mime: "application/gpx+xml",
            },
        };


        downloadFile(
            convertedData,
            `${filename}.${fileSettings[format].extension}`,
            fileSettings[format].mime
        );
    }


    return (
        <button onClick={handleExport}>
            Export {format.toUpperCase()}
        </button>
    );
}