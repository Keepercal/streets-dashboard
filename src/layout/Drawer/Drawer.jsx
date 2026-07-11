import "./Drawer.css"

import BoundaryPanel from './panels/BoundaryPanel/BoundaryPanel'
import LayersPanel from './panels/LayersPanel/LayersPanel'
import DisplayPanel from './panels/DisplayPanel/DisplayPanel'

function Drawer({
    activeDrawer,
    setActiveDrawer,

    boundaryData,
    featureData,
    selectedBoundaryKey,

    loadBoundaryResults,
    handleSelectBoundary,
    boundaryResults,

    featureOptions,
    toggle,
    handleToggle,

    displayMode,
    setDisplayMode,

    handleClearBoundary,
    clearFeatures,
}) {
    return (
        <div className={`drawer ${activeDrawer ? "open" : ""}`}>
            <div className={`drawer-content ${open ? "open" : ""}`}>
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
                    />
                }

                {activeDrawer === "display" &&
                    <DisplayPanel {...props} />
                }
            </div>
        </div>
    )
}

export default Drawer;