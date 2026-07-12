/**
 * App Entry Point
 * -----------
 * npm run dev: Local development server
 * npm run deploy: Builds and deploys to GitHub Pages
 */

import { createRoot } from 'react-dom/client';
import { useState, useEffect, useMemo } from 'react';
import './App.css';

/* High level components */
import Map from './layout/Map/Map.jsx';
import Toolbar from './layout/Toolbar/Toolbar'
import Sidebar from './layout/Sidebar/Sidebar';
import Drawer from './layout/Drawer/Drawer'

/* Popups/Panels */
import StatusPopup from './layout/Popups/StatusPopup/StatusPopup.jsx';
import ExportPanel from './layout/Popups/ExportPanel/ExportPanel.jsx';

/* Map related components */
import FilterPanel from './components/FilterPanel/FilterPanel.jsx';
import Legend from './components/Legend/Legend.jsx';

/* Hooks */
import useBoundarySearch from './hooks/useBoundarySearch.js';
import useBoundary from './hooks/useBoundary.js';
import useMapFeatures from './hooks/useMapFeatures.js';

import evaluateFeature from './utils/evaluateFeatures.js';

/* Misc imports */
import { FEATURE_MAP } from './config/osmFeatureMap.js';

export default function App() {
  const PANELS = {
    EXPORT: "export",
    ABOUT: "about"
  }

  /* DATA STATES */
  const [selectedBoundaryKey, setSelectedBoundaryKey] = useState('none');
  const [toggles, setToggles] = useState({});
  const [filters, setFilters] = useState([]);

  /* UI STATES */
  const [activeDrawer, setActiveDrawer] = useState(null)
  const [statusPopupDismissed, setPopupDismissed] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [displayMode, setDisplayMode] = useState("default");

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

  /* Hook in feature data */
  const {
    featureLayers,
    loadFeatures,
    clearFeatures,
    removeFeature,
    failedFeatureKey,
    status: featureStatus,
    error: featureError,
  } = useMapFeatures();

  const hasFeatures = Object.keys(featureLayers).length > 0; // Flag to check if user has loaded any features

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
 * Uncheck feature toggle when loading fails
 */
  useEffect(() => {
    if (featureStatus === "error" && failedFeatureKey) {
      console.log('[DEBUG] Removing failed feature toggle:', failedFeatureKey);

      setToggles(prev => ({
        ...prev,
        [failedFeatureKey]: false,
      }));
    }
  }, [featureStatus, failedFeatureKey]);

  /*
   * Create feature list from feature map
   */
  const featureOptions = useMemo(() => ([
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
  const filteredLayers = useMemo(() => {
    const result = {};

    Object.entries(featureLayers).forEach(([key, layer]) => {
      if (!layer.geojson?.features) return;

      result[key] = {
        ...layer,
        geojson: {
          ...layer.geojson,
          features: layer.geojson.features.map(feature => ({
            ...feature,
            _matchesFilters: evaluateFeature(feature, filters)
          })),
        },
      };
    });

    return result

  }, [featureLayers, filters]);

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

    // Clear exititing UI state
    setFilters([]);

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

        loadFeatures(
          featureKey,
          selectedBoundaryKey,
          featureTag,
          featureValue,
          featureType
        );

      } else {
        console.log('[DEBUG] Clearing feature', featureKey);
        removeFeature(featureKey);
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
        featureKey: failedFeatureKey,
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
    failedFeatureKey,
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
            const failedKey = status.featureKey;
            console.log('[DEBUG] Removing failed feature');

            if (failedKey) {
              removeFeature(failedKey);

              setToggles(prev => ({
                ...prev,
                [failedKey]: false,
              }));
            }
          }
        }}
      />

      {activeModal === "export" && (
        <ExportPanel
          featureLayers={featureLayers}
          onClose={() => setActiveModal(null)}
        />
      )}

      <header className="app-header">
        <Toolbar
          onOpenPanel={setActiveModal}
          canExport={hasFeatures}
          boundaryName={boundaryData?.elements?.[0]?.tags?.name ?? "None"}
        />
      </header>

      <div className="app-body">

        <div className="sidebar">
          <Sidebar
            boundaryData={boundaryData}
            featureLayers={featureLayers}

            activeDrawer={activeDrawer}
            setActiveDrawer={setActiveDrawer}
          />

        </div>

        <Drawer
          activeDrawer={activeDrawer}
          setActiveDrawer={setActiveDrawer}

          featureLayers={featureLayers}
          selectedBoundaryKey={selectedBoundaryKey}

          loadBoundaryResults={loadBoundaryResults}
          handleSelectBoundary={handleSelectBoundary}
          boundaryResults={boundaryResults}

          featureOptions={featureOptions}
          toggles={toggles}
          handleToggle={handleToggle}

          displayMode={displayMode}
          setDisplayMode={setDisplayMode}

          handleClearBoundary={handleClearBoundary}
          clearFeatures={clearFeatures}
        />

        <div className="main-content">

          {hasFeatures && displayMode === "lastEdited" && <Legend />}

          {hasFeatures && <FilterPanel
            featureLayers={featureLayers}
            filters={filters}
            setFilters={setFilters}
          />}

          <Map
            boundary={boundaryGeojson}
            featureLayers={filteredLayers}
            displayMode={displayMode}
          />

        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);