import "../Map.css";

/**
 * BasemapControl
 * ---------------
 * A Google Maps-style basemap switcher.
 * Displays the active basemap as a thumbnail and allows switching layers.
 */

const basemaps = [
    {
        id: "map",
        label: "Map",
        preview: "/images/map.jpeg"
    },
    {
        id: "openstreetmap",
        label: "OSM",
        preview: "/images/osm.jpeg"
    },
    {
        id: "satellite",
        label: "Satellite",
        preview: "/images/satellite.jpeg"
    }
];

function BasemapControl({ basemap, setBasemap }) {
    const activeLayer = basemaps.find(b => b.id === basemap);

    return (
        <div className="basemap-control">

            {/* Active layer preview */}
            <div className="layers-button">
                <div
                    className="layers-thumbnail"
                    style={{
                        backgroundImage: activeLayer
                            ? `url(${activeLayer.preview})`
                            : "none"
                    }}
                />
                <div className="layers-label">
                    Basemap
                </div>
            </div>

            {/* Layer selector */}
            <div className="layers-menu">
                {basemaps.map((layer) => (
                    <button
                        key={layer.id}
                        className={basemap === layer.id ? "active" : ""}
                        onClick={() => setBasemap(layer.id)}
                    >
                        <img src={layer.preview} alt={layer.label} />
                        <span>{layer.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default BasemapControl;