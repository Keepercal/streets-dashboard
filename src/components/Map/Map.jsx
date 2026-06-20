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

function Map({ boundary, features }) {
  const position = [51.4538, -2.5918]; // Default position
  const [zoom, setZoom] = useState(13); // Distance where points show

  return (
    <div className="map-container">
      <MapContainer
        center={position}
        zoom={13} 
        style={{ height: "100vh", width: "100%"}}
      >
        <ZoomTracker onZoom={setZoom} />

        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
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