import "./Drawer.css"

import BoundaryPanel from './panels/BoundaryPanel/BoundaryPanel'
import LayersPanel from './panels/LayersPanel/LayersPanel'
import DisplayPanel from './panels/DisplayPanel/DisplayPanel'

function Drawer({
    activeDrawer,
    setActiveDrawer,

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
    clearFeatures,
}) {
    const DRAWER_TITLES = {
        boundary: "Search for Boundary",
        layers: "Load Layers",
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

                {activeDrawer === "layers" &&
                    <LayersPanel
                        featureOptions={featureOptions}
                        handleToggle={handleToggle}
                        toggles={toggles}
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