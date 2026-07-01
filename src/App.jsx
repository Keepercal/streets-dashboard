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
import StatusPopup from './components/StatusPopup/StatusPopup.jsx';

/* Map related components */
import FilterPanel from './components/FilterPanel/FilterPanel.jsx';
import Legend from './components/Legend/Legend.jsx';
import FeatureCount from './components/FeatureCounter/FeatureCounter.jsx';

/* Hooks */
import useBoundarySearch from './hooks/useBoundarySearch.js';
import useBoundary from './hooks/useBoundary.js';
import useMapFeatures from './hooks/useMapFeatures.js';

import evaluateFeature from './utils/evaluateFeatures.js';

/* Maps */
import { FEATURE_MAP } from './config/osmFeatureMap.js';

export default function App() {
  const [selectedBoundaryKey, setSelectedBoundaryKey] = useState('none');
  const [toggles, setToggles] = useState({});
  const [filters, setFilters] = useState([]);
  const [statusPopupDismissed, setPopupDismissed] = useState(false);

  const {
    loadBoundaryResults,
    boundaryResults,
    clearBoundaryResults,
  } = useBoundarySearch();

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
  } = useMapFeatures(selectedBoundaryKey);

  /*
   * Reset status popup dismissal when loading starts
   */
  useEffect(() => {
    if (boundaryStatus === 'loading' || featureStatus === 'loading') {
      console.log('[DEBUG] Loading started → resetting statusPopupDismissed');
      setPopupDismissed(false);
    }
  }, [boundaryStatus, featureStatus]);

  /*
   * Create feature list from feature map
   */
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

    setSelectedBoundaryKey(boundaryKey);

    loadBoundary(boundaryKey, boundaryType, boundaryName, boundaryID)
  }
  /**
   * Handle resetting boundary and whiping features
   */
  const handleClearBoundary = () => {
    setSelectedBoundaryKey('none');
    clearBoundaryResults()
    clearBoundary();
    clearFeatures();
    setToggles({});
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
      selectedBoundaryKey,
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
          selectedBoundaryKey,
          featureTag,
          featureValue,
          featureType,
        });

        loadFeatures(selectedBoundaryKey, featureTag, featureValue, featureType);
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

  /**
   * Handle feature toggle
   */
  const statusPopup = useMemo(() => {
    if (statusPopupDismissed) {
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
    statusPopupDismissed,
  ]);

  return (
    <div className="App">
      <StatusPopup
        trigger={statusPopup.trigger}
        type={statusPopup.type}
        title={statusPopup.title}
        message={statusPopup.message}
        onClose={() => {
          console.log('[DEBUG] Popup closed:', statusPopup);

          setPopupDismissed(true);

          if (statusPopup.source === 'boundary') {
            console.log('[DEBUG] Resetting boundary state');
            handleClearBoundary();
            setToggles({});
          }

          if (statusPopup.source === 'feature') {
            console.log('[DEBUG] Clearing feature state');
            clearFeatures();
            setToggles({});
          }
        }}
      />

      <div className="side-bar">
        <Sidebar
          boundaryData={boundaryData}
          featureData={featureData}

          loadBoundaryResults={loadBoundaryResults}
          handleSelectBoundary={handleSelectBoundary}
          boundaryResults={boundaryResults}
          selectedBoundaryKey={selectedBoundaryKey}

          featureOptions={featureOptions}
          toggles={toggles}
          handleToggle={handleToggle}

          handleClearBoundary={handleClearBoundary}
          clearFeatures={clearFeatures}
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
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);