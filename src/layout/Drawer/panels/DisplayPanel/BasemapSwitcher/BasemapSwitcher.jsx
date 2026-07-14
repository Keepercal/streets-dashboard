import "./BasemapSwitcher.css";

/**
 * BasemapSwitcher
 * ---------------
 * A Google Maps-style basemap switcher.
 * Displays the active basemap as a thumbnail and allows switching layers.
 */

const basemaps = [
    {
        id: "carto",
        label: "CARTO",
        preview: "/streets-dashboard/images/carto.jpeg"
    },
    {
        id: "carto_dark",
        label: "CARTO Dark",
        preview: "/streets-dashboard/images/carto_dark.jpeg"
    },
    {
        id: "carto_grey",
        label: "CARTO Grey",
        preview: "/streets-dashboard/images/carto_grey.jpeg"
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

    return (
        <div className="basemap-options">
            {basemaps.map(layer => (
                
                <button
                    key={layer.id}
                    className={
                        basemap === layer.id
                        ? "basemap-option active"
                        : "basemap-option"
                    }
                    onClick={() =>
                        setBasemap(layer.id)
                    }
                >
                    <img
                        src={layer.preview}
                        alt={layer.label}
                    />

                    <span>
                        {layer.label}
                    </span>
                </button>
            ))}
        </div>
    );
}

export default BasemapSwitcher;