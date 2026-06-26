/**
 * App Entry Point
 * -----------
 * npm run dev: Local development server
 * npm run deploy: Builds and deploys to GitHub Pages
 */

import { createRoot } from 'react-dom/client';
import { useState, useEffect, useMemo } from 'react';

import Map from './components/Map/Map';
import Sidebar from './components/Sidebar/Sidebar';
import Popup from './components/Popup/Popup';
import FilterPanel from './components/FilterPanel/FilterPanel.jsx';
import Legend from './components/Legend/Legend.jsx';
import FeatureCount from './components/FeatureCount/FeatureCount.jsx';

import { useBoundary, useMapFeature } from './hooks/useMapData.js';
import { evaluateFeature } from './utils/evaluteFeatures.js';

import { BOUNDARY_MAP } from './config/osmBoundaryMap.js';
import { FEATURE_MAP } from './config/osmFeatureMap.js';


export default function App() {
  const [selectedBoundary, setSelectedBoundary] = useState('none');
  const [toggles, setToggles] = useState({});
  const [filters, setFilters] = useState([]);
  const [popupDismissed, setPopupDismissed] = useState(false);

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

  /**
   * Reset popup dismissal when loading starts
   */
  useEffect(() => {
    if (boundaryStatus === 'loading' || featureStatus === 'loading') {
      console.log('[DEBUG] Loading started → resetting popupDismissed');
      setPopupDismissed(false);
    }
  }, [boundaryStatus, featureStatus]);

  const boundaryOptions = useMemo(() => ([
    { value: 'none', label: 'None', boundaryType: 'none', name: 'None' },
    ...Object.entries(BOUNDARY_MAP).map(([key, boundary]) => ({
      value: key,
      boundaryType: boundary.boundary_type,
      boundaryName: boundary.name,
      label: boundary.label,
    })),
  ]), []);

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
        filter: feature.filter,
      }))
    ),
  ]), []);

  /**
   * Handle feature filtering
   */
  const filteredGeojson = useMemo(() => {
    if (!featureGeojson) return null;

    console.log('[DEBUG] Recomputing filteredGeojson');

    return {
      ...featureGeojson,
      features: featureGeojson.features.map(feature => ({
        ...feature,
        _matchesFilters: evaluateFeature(feature, filters),
      })),
    };
  }, [featureGeojson, filters]);

  /**
   * Handle boundary selection
   */
  const handleDropdown = (_key, value, boundaryType, boundaryName) => {
    console.log('[DEBUG] handleDropdown ENTER:', {
      _key,
      value,
      boundaryType,
      boundaryName,
    });

    clearFeatures();

    console.log('[DEBUG] Calling loadBoundary:', {
      value,
      boundaryType,
      boundaryName,
    });

    loadBoundary(value, boundaryType, boundaryName);

    console.log('[DEBUG] Updating selectedBoundary:', boundaryName);

    setSelectedBoundary(boundaryName); // consider switching to `value`
    setToggles({});
  };

  /**
   * Handle feature toggle
   */
  const handleToggle = (key, tag, value, type) => {
    console.log('[DEBUG] handleToggle ENTER:', {
      key,
      tag,
      value,
      type,
      selectedBoundary,
    });

    setToggles(prev => {
      const nextValue = !prev[key];

      console.log('[DEBUG] Toggle computed:', {
        key,
        from: prev[key],
        to: nextValue,
      });

      if (nextValue) {
        console.log('[DEBUG] Calling loadFeatures:', {
          selectedBoundary,
          tag,
          value,
          type,
        });

        loadFeatures(selectedBoundary, tag, value, type);
      } else {
        console.log('[DEBUG] Clearing features');
        clearFeatures();
      }

      return {
        ...prev,
        [key]: nextValue,
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
          handleDropdown={handleDropdown}
          handleToggle={handleToggle}
          boundaryOptions={boundaryOptions}
          featureOptions={featureOptions}
          boundaryData={boundaryData}
          featureData={featureData}
          selectedBoundary={selectedBoundary}
          toggles={toggles}
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