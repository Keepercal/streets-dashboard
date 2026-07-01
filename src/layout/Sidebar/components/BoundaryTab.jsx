import '../Sidebar.css'
import BoundaryOption from './BoundaryOption';
import InputItem from './InputItem'

const BoundaryTab = ({
    open,
    setOpen,

    loadBoundaryResults,
    handleClearBoundary,
    clearFeatures,

    boundaryResults,
    selectedBoundaryKey,
    onSelectBoundary,

    hasSearched,
    setHasSearched
}) => {
    return (
        <div className={`sidebar-tab ${open ? "is-open" : ""}`}>

            <h3
                className="tab-header"
                onClick={() => setOpen(prev => !prev)}
            >
                Search Boundary
                <span className={`arrow ${open ? "rotated" : ""}`}>▸</span>
            </h3>

            <div className={`tab-content ${open ? "open" : ""}`}>

                <div className="tab-body">
                    <InputItem
                        onSearch={loadBoundaryResults}
                        setHasSearched={setHasSearched}

                        handleClearBoundary={handleClearBoundary}
                        clearFeatures={clearFeatures}
                    />
                </div>

                <div className="tab-list">
                    {hasSearched ? (
                        <BoundaryOption
                            boundaryResults={boundaryResults}
                            onSelectBoundary={onSelectBoundary}
                            selectedBoundaryKey={selectedBoundaryKey}
                            clearFeatures={clearFeatures}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default BoundaryTab;