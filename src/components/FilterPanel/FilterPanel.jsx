import { useState } from 'react';
import './FilterPanel.css';

function FilterPanel({ features, filters, setFilters }) {
    const [collapsed, setCollapsed] = useState(true);

    const tagSet = new Set(); // Extract all tag keys
    const tagValueMap = {}; // Extract tag values per key

    features?.features?.forEach(feature => {
        const tags = feature?.properties || {};

        Object.entries(tags).forEach(([key, value]) => {
            tagSet.add(key);

            if (!tagValueMap[key]) {
                tagValueMap[key] = new Set();
            }
            tagValueMap[key].add(value);
        });
    });

    const tags = [...tagSet].sort();

    const getValues = (key) =>
        tagValueMap[key] ? [...tagValueMap[key]].sort() : [];

    return (
        <div className="filter-panel">

            {/* Header */}
            <div
                className="filter-header"
                onClick={() => setCollapsed(!collapsed)}
            >
                <h3>
                    Filter Panel {collapsed ? "▸" : "▾"}
                </h3>
            </div>

            {!collapsed && (
                <div className="filter-content">

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
                                        <option value="equals">equals</option>
                                        <option value="not_equals">not equals</option>
                                        <option value="exists">exists</option>
                                        <option value="missing">missing</option>
                                    </select>
                                    
                                    {/* Value dropdown (dynamic per tag) */}
                                    {filter.operator !== "exists" &&
                                        filter.operator !== "missing" && (
                                            <select
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
                                            operator: "equals",
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
            )}
        </div>
    );
}

export default FilterPanel;