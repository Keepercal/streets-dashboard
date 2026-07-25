/**
 * App Entry Point
 * -----------
 * npm run dev: Local development server
 * npm run deploy: Builds and deploys to GitHub Pages
 */

import { createRoot } from 'react-dom/client';
import { useMemo, useEffect, useState, useRef } from 'react';
import './App.css';

/* High level components */
import Map from './layout/Map/Map.jsx';
import Toolbar from './layout/Toolbar/Toolbar'
import Sidebar from './layout/Sidebar/Sidebar';
import Drawer from './layout/Drawer/Drawer'

/* Popups/Panels */
import StatusPopup from './layout/Popups/StatusPopup/StatusPopup.jsx';
import ExportModal from './layout/Modals/ExportModal/ExportModal.jsx';

/* Map related components */
import Legend from './components/Legend/Legend.jsx';

/* Hooks */
import useBoundarySearch from './hooks/useBoundarySearch.js';
import useBoundaryData from './hooks/useBoundaryData.js';
import useMapFeatures from './hooks/useMapFeatures.js';
import useFilteredLayers from './hooks/useFilteredLayers.js';
import useStatusPopup from './hooks/useStatusPopup.js';
import useProject from './hooks/useProject.js';

/* Misc imports */
import { FEATURE_OPTIONS } from './config/featureOptions.js';


export default function App() {
  const PANELS = {
    EXPORT: "export",
    ABOUT: "about"
  }

  /* UI STATES */
  const [activeDrawer, setActiveDrawer] = useState(null) // which drawer is open
  const [activeLayer, setActiveLayer] = useState(null) // which layer the user is inspecting
  const [activeModal, setActiveModal] = useState(null);

  const [basemap, setBasemap] = useState("carto");
  const [displayMode, setDisplayMode] = useState("default"); // or by last edit

  /* DATA STATES */
  const [selectedBoundaryKey, setSelectedBoundaryKey] = useState('none');

  /* FLAGS */
  const didRestore = useRef(false)

  const {
    loadBoundaryResults,
    boundaryResults,
    clearBoundaryResults,
  } = useBoundarySearch();

  const {
    // boundary data
    boundaryData,
    boundaryGeojson,

    // boundary handling
    loadBoundary,
    clearBoundary,

    exportBoundary,
    restoreBoundary,

    // status
    status: boundaryStatus,
    error: boundaryError,
  } = useBoundaryData();

  /* Hook in feature data */
  const {
    //state
    featureLayers,

    // data operations
    loadFeatures,
    clearFeatures,
    removeLayer,

    // layer editing
    toggleLayerVisibility,
    updateLayer,
    addLayerFilter,
    updateLayerFilters,
    removeLayerFilter,

    // persistence
    exportLayers,
    restoreLayers,

    // cache
    getCachedFeatures,
    clearCache,

    // status
    failedFeatureKey,
    status: featureStatus,
    error: featureError,
  } = useMapFeatures();

  const {
    statusPopup,
    dismissPopup,
  } = useStatusPopup({
    boundaryStatus,
    boundaryError,
    featureStatus,
    featureError,
    failedFeatureKey
  })

  /**
   * Handle input for boundary search
  */
  const handleSelectBoundary = (result) => {
    console.log('[DEBUG] handleSelectBoundary ENTER:', result);

    const {
      osm_id: boundaryID,
      osm_type: boundaryType,
      display_name: boundaryName,
    } = result;

    setSelectedBoundaryKey(boundaryID);

    loadBoundary(boundaryID, boundaryType, boundaryName)
  }

  /**
   * Handle resetting boundary and whiping features
   */
  const handleClearBoundaryResults = () => {
    clearBoundaryResults();
  }

  /**
   * Handle resetting boundary and whiping features
   */
  const handleClearBoundary = () => {
    setSelectedBoundaryKey('none');
    clearBoundary();
    clearFeatures();
    //clearCache();
  }

  /* Handle renaming features */
  const renameLayer = (layerID, newLabel) => {
    console.log('[DEBUG] renameLayer ENTER:', layerID, newLabel);
    updateLayer(layerID, {
      displayName: newLabel
    });
  };

  /* Handle feature adding to project */
  const handleAddLayer = (
    featureKey,
    featureTag,
    featureValue,
    featureType,
    featureLabel,
  ) => {

    console.log('[DEBUG] handleAddLayer ENTER:', {
      featureKey,
      featureTag,
      featureValue,
      featureType,
      featureLabel,
      selectedBoundaryKey,
    });

    loadFeatures({
      featureKey,
      boundaryKey: selectedBoundaryKey,
      featureTag,
      featureValue,
      featureType,
      featureLabel
    });

  };

  const boundaryState = useMemo(() => ({
    selectedBoundaryKey,
    data: boundaryData,
    geojson: boundaryGeojson
  }), [
    selectedBoundaryKey,
    boundaryData,
    boundaryGeojson
  ])

  function restoreProject(project) {

    if(!project) return;

    console.log("[DEBUG] Restoring project", project)

    setBasemap(project.settings?.basemap ?? "carto");

    setDisplayMode(
        project.settings?.displayMode ?? "default"
    );

    setSelectedBoundaryKey(
        project.boundary?.selectedBoundaryKey ?? "none"
    );

    restoreBoundary(
        project.boundary
    );

    restoreLayers(
        project.layers ?? []
    );
}

  // Handles project saving and loading
  const projectManager = useProject({

    basemap,
    displayMode,

    boundary: boundaryState,

    layers: exportLayers(),

    onRestore: restoreProject

  });

  useEffect(() => {
    if (didRestore.current) return;

    didRestore.current = true;

    projectManager.restoreAutosave();
  }, [projectManager]);

  const hasBoundary = Object.keys(boundaryData ?? {}).length > 0; // Flag to check if boundary exists
  const hasFeatures = Object.keys(featureLayers).length > 0; // Flag to check if features exist
  const filteredLayers = useFilteredLayers(featureLayers);

  return (
    <div className="App">
      {/* Popups */}
      <StatusPopup
        trigger={statusPopup.trigger}
        type={statusPopup.type}
        title={statusPopup.title}
        message={statusPopup.message}
        onClose={() => {
          console.log('[DEBUG] Popup closed:', statusPopup);

          dismissPopup();

          if (statusPopup.source === 'boundary') {
            console.log('[DEBUG] Resetting boundary state');
            handleClearBoundary();
          }

          if (statusPopup.source === 'feature') {
            const failedKey = statusPopup.featureKey;
            console.log('[DEBUG] Removing failed feature');

            if (failedKey) {
              removeLayer(failedKey);
            }
          }
        }}
      />

      {/* Modals */}
      {activeModal === "export" && (
        <ExportModal
          featureLayers={filteredLayers}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Main UI */}
      <header className="app-header">
        <Toolbar
          onOpenModal={setActiveModal}
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
          hasBoundary={hasBoundary}
          activeDrawer={activeDrawer}
          setActiveDrawer={setActiveDrawer}

          featureLayers={featureLayers}
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
          handleAddLayer={handleAddLayer}

          updateLayer={updateLayer}
          toggleLayerVisibility={toggleLayerVisibility}
          renameLayer={renameLayer}

          updateLayerFilters={updateLayerFilters}

          selectedBoundaryKey={selectedBoundaryKey}

          loadBoundaryResults={loadBoundaryResults}
          handleSelectBoundary={handleSelectBoundary}
          boundaryResults={boundaryResults}

          featureOptions={FEATURE_OPTIONS}

          basemap={basemap}
          setBasemap={setBasemap}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}

          handleClearBoundaryResults={handleClearBoundaryResults}
          handleClearBoundary={handleClearBoundary}
          removeLayer={removeLayer}
          clearFeatures={clearFeatures}
          cachedFeatures={getCachedFeatures(selectedBoundaryKey)}
        />

        <div className="main-content">

          {hasFeatures && displayMode === "lastEdited" && <Legend />}

          <Map
            boundary={boundaryGeojson}
            featureLayers={filteredLayers}
            displayMode={displayMode}
            basemap={basemap}
          />

        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);