import "./BasemapSwitcher.css";

/**
 * BasemapSwitcher
 * ---------------
 * A Google Maps-style basemap switcher.
 * Displays the active basemap as a thumbnail and allows switching layers.
 */

const basemaps = [
    {
        id: "map",
        label: "Map",
        preview: "/streets-dashboard/images/map.jpeg"
    },
    {
        id: "openstreetmap",
        label: "OSM",
        preview: "/streets-dashboard/images/osm.jpeg"
    },
    {
        id: "satellite",
        label: "Satellite",
        preview: "/streets-dashboard/images/satellite.jpeg"
    }
];

function BasemapSwitcher({ basemap, setBasemap }) {
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

export default BasemapSwitcher;