import { useMapEvent } from 'react-leaflet'

export default function ZoomTracker({ onZoom }){
    useMapEvent({
        zoomend(e){
            onZoom(e.target.getZoom());
        }
    });
    return null;
}