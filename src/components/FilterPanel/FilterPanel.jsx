// Dynamically generates filter controls from feature properties.
// Users can add, modify, and remove attribute-based filters.

import { useState, useMemo } from 'react';
import './FilterPanel.css';

function FilterPanel({ features, filters, setFilters }) {
    const [collapsed, setCollapsed] = useState(true); // Panel initially beginds collapsed

    // Extract all unique property keys and values from the feature collection
    // Memorised so this only reruns when the feature data changes
    const { tagSet, tagValueMap } = useMemo(() =>{
        const tagSet = new Set(); // Stores unique tag/property names of features
        const tagValueMap = {}; // Maps each tag to its unique values

        features?.features?.forEach(feature => { // Scan every feature to build the avaliable filter options
            const tags = feature?.properties || {};

            Object.entries(tags).forEach(([key, value]) => { // Process each property key/value pair on the feature
                tagSet.add(key);

                if (!tagValueMap[key]) { // Create a set for a key if it doesn't exist yet
                    tagValueMap[key] = new Set();
                }
                tagValueMap[key].add(value); // Store the unique value for this property key
            });
        });

        return { tagSet, tagValueMap };
    }, [features]);

    const activeKeys = new Set (filters.map(f => f.key)); // Dertime which filters already exist

    const tags = [...tagSet] // Build avaliable tags list
        .filter(tag => !activeKeys.has(tag)) // Remove tags already in use
        .sort(); // Alphabetically sort

    const getValues = (key) => // Return all known values of a tag, sorted alphavetically
        tagValueMap[key] ? [...tagValueMap[key]].sort() : [];

    return (
        <div className={`filter-panel ${collapsed ? "collapsed" : "expanded"}`}>

            {/* Header */}
            <div className="filter-header" onClick={() => setCollapsed(!collapsed)}>
                <h3>
                    Filter Panel
                    <span className={`arrow ${collapsed ? "" : "open"}`}>
                        ▸
                    </span>
                </h3>
            </div>

            <div className={`filter-content-wrapper ${collapsed ? "collapsed" : "expanded"}`}>
                <div className={`filter-content ${collapsed ? "collapsed" : "expanded"}`}>
                    {/* Active Filters */}
                    {filters.length > 0 && (
                        <div className="active-filters">
                            <h4>Active Filters</h4>

                            {filters.map((filter, index) => (
                                <div
                                    key={`${filter.key}-${index}`}
                                    className="filter-row"
                                >
                                    <strong>{filter.key}</strong>

                                    <select
                                        value={filter.operator}
                                        onChange={(e) => 
                                            setFilters(prev =>
                                                prev.map((f, i) =>
                                                    i === index
                                                        ? {...f, operator: e.target.value}
                                                        : f
                                                )
                                            )
                                        }
                                    >
                                        <option value=""></option>
                                        <option value="equals">equals</option>
                                        <option value="not_equals">not equals</option>
                                        <option value="exists">exists</option>
                                        <option value="missing">missing</option>
                                    </select>
                                    
                                    {/* Value dropdown (dynamic per tag) */}
                                    {filter.operator !== "" &&
                                        filter.operator !== "exists" &&
                                            filter.operator !== "missing" && (
                                                <select
                                                    id="filter-select"
                                                    value={filter.value}
                                                    onChange={(e) =>
                                                        setFilters(prev =>
                                                            prev.map((f, i) =>
                                                                i === index
                                                                    ? {...f, value: e.target.value}
                                                                    : f
                                                            )
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        -- any value --
                                                    </option>

                                                    {getValues(filter.key).map(val => (
                                                        <option key={val} value={val}>
                                                            {val}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}

                                    <button
                                        onClick={() =>
                                            setFilters( prev =>
                                                prev.filter((_, i) => i !== index)
                                            )
                                        }
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Available Tags */}
                    <h4>Available Tags</h4>

                    {tags.map(tag => (
                        <div key={tag} className="filter-item">
                            <span>{tag}</span>

                            <button
                                onClick={() =>
                                    setFilters(prev => [
                                        ...prev,
                                        {
                                            key: tag,
                                            operator: "",
                                            value: ""
                                        }
                                    ])
                                }
                            >
                                +
                            </button>
                        </div>
                    ))}
                </div>
            </div>
    </div>
    );
}

export default FilterPanel;