import { useState } from 'react';

/* UI Components */
import InputItem from './components/InputItem'
import BoundaryOption from './components/BoundaryOption';

/**
 * BoundaryTab.jsx
 * ------------
 * UI component in sidebar which contains boundary selection
 *
 * Features:
 * - Select a boundary

 */
const BoundaryPanel = ({
    loadBoundaryResults,
    handleClearBoundary,
    clearFeatures,

    boundaryResults,
    selectedBoundaryKey,
    onSelectBoundary,
}) => {
    const [hasSearched, setHasSearched] = useState(false);

    return (
        <>
            <div className="panel-header">
                <h3>Select Boundary</h3>
            </div>
            <div className="boundary-panel-body">
                <InputItem
                    onSearch={loadBoundaryResults}
                    setHasSearched={setHasSearched}

                    handleClearBoundary={handleClearBoundary}
                    clearFeatures={clearFeatures}
                />
            </div>

            <div className="boundary-panel-list">
                {hasSearched ? (
                    <BoundaryOption
                        boundaryResults={boundaryResults}
                        onSelectBoundary={onSelectBoundary}
                        selectedBoundaryKey={selectedBoundaryKey}
                        clearFeatures={clearFeatures}
                    />
                ) : null}
            </div>
        </>
    )
}

export default BoundaryPanel;