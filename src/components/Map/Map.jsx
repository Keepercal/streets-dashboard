import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import App from '../../App';
import 'leaflet/dist/leaflet.css';
import './Map.css'
import L from "leaflet";

import BoundaryLayer from './layers/BoundaryLayer'
import FeatureLayer from './layers/FeatureLayer'
import FitBounds from './controls/FitBounds'
import ZoomTracker from "./controls/ZoomTracker"
import BasemapControl from './controls/BasemapControl';

function Map({ boundary, features }) {
  const position = [51.4538, -2.5918]; // Default position
  const [zoom, setZoom] = useState(13); // Distance where points show
  const [basemap, setBasemap] = useState("map");

  const basemaps = {
        map: {
            name: "Map",
            url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        },
        openstreetmap: {
            name: "OpenStreetMap",
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        },
        satellite: {
            name: "Satelite",
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attribution: "&copy; Esri",
        },
  }

  return (
    <div className="map-container">

      <BasemapControl
        basemap={basemap}
        setBasemap={setBasemap}
      />

      <MapContainer
        center={position}
        zoom={13} 
        style={{ height: "100vh", width: "100%"}}
      >
        <ZoomTracker onZoom={setZoom} />

        <TileLayer
          attribution={basemaps[basemap].attribution}
          url={basemaps[basemap].url}
        />
        {features && (
          <FeatureLayer 
            features={features}
            zoom={zoom}
          />
        )}
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