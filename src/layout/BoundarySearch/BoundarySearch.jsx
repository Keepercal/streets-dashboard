import './BoundarySearch.css';
import InputItem from './InputItem';

function BoundarySearch({ searchBoundaries, boundaryResults, onSelectBoundary }) {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1 className="sidebar-title">{window.APP_NAME}</h1>
                <p className="version-tag">{window.APP_VERSION}</p>

                <h2>Search Boundary</h2>

                <InputItem
                    searchBoundaries={searchBoundaries}
                />

                <div className="sidebar-content">
                    {boundaryResults?.map(result =>(
                        <div 
                            key={result.place_id}
                            className="boundary-card"
                            onClick={() => onSelectBoundary(result)}
                        >
                            <div className="title">
                                {result.display_name}
                            </div>

                            <div className="meta">
                                {result.type} · {result.class}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BoundarySearch;