import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import App from "../../App"

import BoundaryLayer from "./layers/BoundaryLayer";
import FeatureLayer from "./layers/FeatureLayer";
import FitBounds from "./controls/FitBounds";
import ZoomTracker from "./controls/ZoomTracker";
import BasemapSwitcher from "../../components/BasemapSwitcher/BasemapSwitcher";

import BASEMAPS from './config/basemaps'

/**
 * Map
 * ---
 * Main map container that handles:
 * - Basemap switching
 * - Feature rendering
 * - Boundary fitting
 * - Zoom tracking
 */

function Map({ boundary, featureLayers, displayMode }) {
    //const position = [54.0182, -2.5471]; // Bristol
    const position = [54.0182, -2.5471]; // UK

    const [zoom, setZoom] = useState(13);
    const [basemap, setBasemap] = useState("carto");

    const activeBasemap = BASEMAPS[basemap];

    return (
        <>
            {/* Basemap switcher UI */}
            {/*<BasemapSwitcher
                basemap={basemap}
                setBasemap={setBasemap}
            />*/}

            <MapContainer
                center={position}
                //zoom={13} // Bristol
                zoom={6} // UK
                zoomControl={false}
                style={{ height: "100vh", width: "100%" }}
            >

                <ZoomControl position="topright"/>

                {/* Track zoom level */}
                <ZoomTracker onZoom={setZoom} />

                {/* Basemap tiles */}
                <TileLayer
                    key={basemap}
                    url={activeBasemap.url}
                    attribution={activeBasemap.attribution}
                />

                {/* Feature overlays */}
                <FeatureLayer
                    featureLayers={featureLayers}
                    zoom={zoom}
                    displayMode={displayMode}
                />

                {/* Boundary + auto-fit */}
                {boundary && (
                    <>
                        <BoundaryLayer boundary={boundary} />
                        <FitBounds boundary={boundary} />
                    </>
                )}

            </MapContainer>
        </>
    );
}

export default Map;