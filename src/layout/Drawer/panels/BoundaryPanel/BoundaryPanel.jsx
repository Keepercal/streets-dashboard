import './BoundaryPanel.css'

import { useState } from 'react';

/* UI Components */
import DeleteButton from './components/DeleteButton/DeleteButton';
import InputItem from './components/InputItem/InputItem'
import BoundaryOption from './components/BoundaryOption/BoundaryOption';
import BoundaryIndicator from '../../../../components/BoundaryIndicator/BoundaryIndicator';

/**
 * BoundaryTab.jsx
 * ------------
 * UI component in sidebar which contains boundary selection
 *
 * Features:
 * - Select a boundary

 */
const BoundaryPanel = ({
    hasBoundary,
    loadBoundaryResults,
    handleClearBoundaryResults,
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
                <DeleteButton
                    handleClearBoundary={handleClearBoundary}
                    disabled={!hasBoundary}
                />

                <InputItem
                    onSearch={loadBoundaryResults}
                    setHasSearched={setHasSearched}

                    handleClearBoundaryResults={handleClearBoundaryResults}
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