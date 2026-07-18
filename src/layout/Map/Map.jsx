import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import App from "../../App"

import BoundaryLayer from "./layers/BoundaryLayer";
import FeatureLayer from "./layers/FeatureLayer";
import HeatmapLayer from "./layers/HeatmapLayer";
import FitBounds from "./controls/FitBounds";
import ZoomTracker from "./controls/ZoomTracker";

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

function Map({ boundary, featureLayers, displayMode, basemap }) {
    //const position = [54.0182, -2.5471]; // Bristol
    const position = [54.0182, -2.5471]; // UK

    const [zoom, setZoom] = useState(13);

    const activeBasemap = BASEMAPS[basemap] ?? BASEMAPS.carto;

    return (
        <>
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

                {displayMode === "heatmap" ? (
                    <HeatmapLayer
                        featureLayers={featureLayers}
                    />
                ) : (
                    <FeatureLayer
                        featureLayers={featureLayers}
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
        </>
    );
}

export default Map;