import { GeoJSON } from "react-leaflet";

/**
 * BoundaryLayer
 * --------------
 * Renders a GeoJSON boundary overlay on the map.
 * Styled as a subtle red outline with low fill opacity.
 */
export default function BoundaryLayer({ boundary }) {
    const style = {
        color: "red",
        weight: 2,
        fillOpacity: 0.04,
        interactive: false
    };

    return (
        <GeoJSON
            data={boundary}
            style={style}
            pointToLayer={() => null}
        />
    );
}