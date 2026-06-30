/**
 * App Entry Point
 * -----------
 * npm run dev: Local development server
 * npm run deploy: Builds and deploys to GitHub Pages
 */

import { createRoot } from 'react-dom/client';
import { useState, useEffect, useMemo } from 'react';

/* High level components */
import Map from './layout//Map/Map.jsx';
import Sidebar from './layout/Sidebar/Sidebar';
import Popup from './components/StatusPopup/StatusPopup.jsx';

/* Map related components */
import FilterPanel from './components/FilterPanel/FilterPanel.jsx';
import Legend from './components/Legend/Legend.jsx';
import FeatureCount from './components/FeatureCounter/FeatureCounter.jsx';

/* Hooks */
import { useBoundary, useMapFeature, useSearchBoundaries } from './hooks/useMapData.js';
import { evaluateFeature } from './utils/evaluateFeatures.js';

/* Maps */
import { BOUNDARY_MAP } from './config/osmBoundaryMap.js';
import { FEATURE_MAP } from './config/osmFeatureMap.js';

export default function App() {
  const [selectedBoundary, setSelectedBoundary] = useState('none');
  const [toggles, setToggles] = useState({});
  const [filters, setFilters] = useState([]);
  const [popupDismissed, setPopupDismissed] = useState(false);

  const {
    boundaryResults,
    searchBoundaries
  } = useSearchBoundaries();

  const {
    boundaryData,
    boundaryGeojson,
    loadBoundary,
    clearBoundary,
    status: boundaryStatus,
    error: boundaryError,
  } = useBoundary();

  const {
    featureData,
    featureGeojson,
    loadFeatures,
    clearFeatures,
    status: featureStatus,
    error: featureError,
  } = useMapFeature(selectedBoundary);

  /*
   * Reset popup dismissal when loading starts
   */
  useEffect(() => {
    if (boundaryStatus === 'loading' || featureStatus === 'loading') {
      console.log('[DEBUG] Loading started → resetting popupDismissed');
      setPopupDismissed(false);
    }
  }, [boundaryStatus, featureStatus]);

  /*const boundaryOptions = useMemo(() => ([
    { key: 'none', boundaryType: 'none', name: 'None', label: 'None' },
    ...Object.entries(BOUNDARY_MAP).map(([key, boundary]) => ({
      key: key,
      boundaryType: boundary.boundaryType,
      name: boundary.name,
      label: boundary.label,
      id: boundary.id,
    })),
  ]), []);*/

  const featureOptions = useMemo(() => ([
    { value: 'none', label: 'None' },
    ...Object.entries(FEATURE_MAP).flatMap(([group, features]) =>
      Object.entries(features).map(([key, feature]) => ({
        value: key,
        key,
        group,
        tag: feature.tag,
        label: feature.label,
        type: feature.type,
      }))
    ),
  ]), []);

  /*
   * Handle feature filtering
   */
  const filteredGeojson = useMemo(() => {
    if (!featureGeojson) return null;

    return {
      ...featureGeojson,
      features: featureGeojson.features.map(feature => ({
        ...feature,
        _matchesFilters: evaluateFeature(feature, filters),
      })),
    };
  }, [featureGeojson, filters]);

  /**
   * Handle input for boundary search
  */
  const handleSelectBoundary = (result) => {
    console.log('[DEBUG] handleSelectBoundary ENTER:', result);

    const boundaryKey = result.osm_id;
    const boundaryType = result.osm_type;
    const boundaryName = result.display_name;
    const boundaryID = result.place_id;

    setSelectedBoundary(boundaryKey);

    loadBoundary(boundaryKey, boundaryType, boundaryName, boundaryID)
  }

  /**
   * Handle feature toggle
   */
  const handleToggle = (featureKey, featureTag, featureValue, featureType) => {
    console.log('[DEBUG] handleToggle ENTER:', {
      featureKey,
      featureTag,
      featureValue,
      featureType,
      selectedBoundary,
    });

    setToggles(prev => {
      const nextValue = !prev[featureKey];

      console.log('[DEBUG] Toggle computed:', {
        featureKey,
        from: prev[featureKey],
        to: nextValue,
      });

      if (nextValue) {
        console.log('[DEBUG] Calling loadFeatures:', {
          selectedBoundary,
          featureTag,
          featureValue,
          featureType,
        });

        loadFeatures(selectedBoundary, featureTag, featureValue, featureType);
      } else {
        console.log('[DEBUG] Clearing features');
        clearFeatures();
      }

      return {
        ...prev,
        [featureKey]: nextValue,
      };
    });
  };

  const popup = useMemo(() => {
    if (popupDismissed) {
      console.log('[DEBUG] Popup dismissed → idle state');
      return {
        trigger: false,
        type: 'idle',
        source: null,
        title: '',
        message: '',
      };
    }

    if (boundaryStatus === 'loading') {
      console.log('[DEBUG] Popup: boundary loading');
      return {
        trigger: true,
        type: 'loading',
        source: 'boundary',
        title: 'Loading',
        message: 'Fetching boundary data...',
      };
    }

    if (boundaryStatus === 'error') {
      console.log('[DEBUG] Popup: boundary error', boundaryError);
      return {
        trigger: true,
        type: 'error',
        source: 'boundary',
        title: 'Error',
        message: boundaryError?.message,
      };
    }

    if (featureStatus === 'loading') {
      console.log('[DEBUG] Popup: feature loading');
      return {
        trigger: true,
        type: 'loading',
        source: 'feature',
        title: 'Loading',
        message: 'Fetching feature data...',
      };
    }

    if (featureStatus === 'error') {
      console.log('[DEBUG] Popup: feature error', featureError);
      return {
        trigger: true,
        type: 'error',
        source: 'feature',
        title: 'Error',
        message: featureError?.message,
      };
    }

    return {
      trigger: false,
      type: 'idle',
      source: null,
      title: '',
      message: '',
    };
  }, [
    boundaryStatus,
    featureStatus,
    boundaryError,
    featureError,
    popupDismissed,
  ]);

  return (
    <div className="App">
      <Popup
        trigger={popup.trigger}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => {
          console.log('[DEBUG] Popup closed:', popup);

          setPopupDismissed(true);

          if (popup.source === 'boundary') {
            console.log('[DEBUG] Resetting boundary state');
            setSelectedBoundary('none');
            clearBoundary();
            clearFeatures();
            setToggles({});
          }

          if (popup.source === 'feature') {
            console.log('[DEBUG] Clearing feature state');
            clearFeatures();
            setToggles({});
          }
        }}
      />

      <div className="side-bar">
        <Sidebar
          handleToggle={handleToggle}
          featureOptions={featureOptions}
          boundaryData={boundaryData}
          featureData={featureData}
          selectedBoundary={selectedBoundary}
          toggles={toggles}
          searchBoundaries={searchBoundaries}
          clearBoundary={clearBoundary}
          boundaryResults={boundaryResults}
          onSelectBoundary={handleSelectBoundary}
        />
      </div>

      <div className="main-content">
        <Map boundary={boundaryGeojson} features={filteredGeojson} />

        {featureData && <FilterPanel
          features={featureGeojson}
          filters={filters}
          setFilters={setFilters}
        />}

        {featureData && <Legend />}

        {featureData && <FeatureCount features={featureData} />}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);