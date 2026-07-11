import './BoundaryPanel.css'

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
            <div className="panel-body">
                <InputItem
                    onSearch={loadBoundaryResults}
                    setHasSearched={setHasSearched}

                    handleClearBoundary={handleClearBoundary}
                    clearFeatures={clearFeatures}
                />

                {hasSearched ? (
                    <div className="boundary-results">
                        <BoundaryOption
                            boundaryResults={boundaryResults}
                            onSelectBoundary={onSelectBoundary}
                            selectedBoundaryKey={selectedBoundaryKey}
                            clearFeatures={clearFeatures}
                        />
                    </div>
                ) : null}
            </div>
        </>
    )
}

export default BoundaryPanel;