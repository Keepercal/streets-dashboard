import '../Map.css'

const basemaps = [
    {
        id: "map",
        label: "Map",
        preview: "public/images/map.jpeg"
    },

    {
        id: "openstreetmap",
        label: "OSM",
        preview: "public/images/osm.jpeg"
    },

    {
        id:
            "satellite",
        label: "Satellite",
        preview: "public/images/satellite.jpeg"
    },
];

function BasemapControl({ basemap, setBasemap }) {
    const activeLayer = basemaps.find(b => b.id === basemap);

    return (
        <div className="basemap-control">
            <div className="layers-button">
                <div
                    className="layers-thumbnail"
                    style={{
                        backgroundImage: `url(${activeLayer?.preview})`
                    }}
                />
                <div className="layers-label">
                    Basemap
                </div>
            </div>

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
    )

};

export default BasemapControl;

