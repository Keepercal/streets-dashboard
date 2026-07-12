import "./Drawer.css"

import BoundaryPanel from './panels/BoundaryPanel/BoundaryPanel'
import AddLayersPanel from './panels/AddLayersPanel/AddLayersPanel'
import ManageLayersPanel from './panels/ManageLayersPanel/ManageLayersPanel'
import DisplayPanel from './panels/DisplayPanel/DisplayPanel'

function Drawer({
    activeDrawer,
    setActiveDrawer,

    featureLayers,
    activeLayer,
    setActiveLayer,
    updateLayer,
    toggleFeatureVisibility,

    selectedBoundaryKey,
    loadBoundaryResults,
    handleSelectBoundary,
    boundaryResults,

    featureOptions,
    toggles,
    handleToggle,

    displayMode,
    setDisplayMode,

    handleClearBoundary,
    removeFeature,
    clearFeatures,
}) {
    const DRAWER_TITLES = {
        boundary: "Search for Boundary",
        addLayers: "Add Layers",
        manageLayers: "Manage Layers",
        display: "Display"
    }

    return (
        <div className={`drawer ${activeDrawer ? "open" : ""}`}>

            <div className="drawer-header">
                <h2>
                    {DRAWER_TITLES[activeDrawer]}
                </h2>

                <button
                    className="drawer-close"
                    onClick={() => setActiveDrawer(null)}
                    aria-label="Close drawer"
                >
                    ×
                </button>
            </div>

            <div className="drawer-content">
                {activeDrawer === "boundary" &&
                    <BoundaryPanel
                        loadBoundaryResults={loadBoundaryResults}
                        handleClearBoundary={handleClearBoundary}
                        clearFeatures={clearFeatures}

                        boundaryResults={boundaryResults}
                        selectedBoundaryKey={selectedBoundaryKey}
                        onSelectBoundary={handleSelectBoundary}
                    />
                }

                {activeDrawer === "addLayers" &&
                    <AddLayersPanel
                        featureOptions={featureOptions}
                        handleToggle={handleToggle}
                        toggles={toggles}
                    />
                }


                {activeDrawer === "manageLayers" &&
                    <ManageLayersPanel
                        featureLayers={featureLayers}
                        toggleFeatureVisibility={toggleFeatureVisibility}
                        updateLayer={updateLayer}
                        removeFeature={removeFeature}
                    />
                }

                {activeDrawer === "display" &&
                    <DisplayPanel
                        displayMode={displayMode}
                        setDisplayMode={setDisplayMode}
                    />
                }
            </div>
        </div>
    )
}

export default Drawer;