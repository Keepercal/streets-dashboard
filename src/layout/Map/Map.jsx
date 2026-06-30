import { MapContainer, TileLayer } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import App from "../../App"

import BoundaryLayer from "./layers/BoundaryLayer";
import FeatureLayer from "./layers/FeatureLayer";
import FitBounds from "./controls/FitBounds";
import ZoomTracker from "./controls/ZoomTracker";
import BasemapSwitcher from "../../components/BasemapSwitcher/BasemapSwitcher";

/**
 * Map
 * ---
 * Main map container that handles:
 * - Basemap switching
 * - Feature rendering
 * - Boundary fitting
 * - Zoom tracking
 */

const BASEMAPS = {
    map: {
        name: "Map",
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    },
    openstreetmap: {
        name: "OpenStreetMap",
        url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satellite: {
        name: "Satellite",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: "&copy; Esri",
    },
};

function Map({ boundary, features }) {
    const position = [51.4538, -2.5918];

    const [zoom, setZoom] = useState(13);
    const [basemap, setBasemap] = useState("map");

    const activeBasemap = BASEMAPS[basemap];

    return (
        <div className="map-container">

            {/* Basemap switcher UI */}
            <BasemapSwitcher
                basemap={basemap}
                setBasemap={setBasemap}
            />

            <MapContainer
                center={position}
                zoom={13}
                style={{ height: "100vh", width: "100%" }}
            >

                {/* Track zoom level */}
                <ZoomTracker onZoom={setZoom} />

                {/* Basemap tiles */}
                <TileLayer
                    key={basemap}
                    url={activeBasemap.url}
                    attribution={activeBasemap.attribution}
                />

                {/* Feature overlays */}
                {features && (
                    <FeatureLayer
                        features={features}
                        zoom={zoom}
                    />
                )}

                {/* Boundary + auto-fit */}
                {boundary && (
                    <>
                        <BoundaryLayer boundary={boundary} />
                        <FitBounds boundary={boundary} />
                    </>
                )}

            </MapContainer>
        </div>
    );
}

export default Map;