import { useState } from 'react';
import './FilterPanel.css';

function FilterPanel({ features, filters, setFilters }) {
    const [collapsed, setCollapsed] = useState(true);

    const tagSet = new Set();

    features?.features?.forEach(feature => {
        const tags = feature?.properties || {};

        Object.keys(tags).forEach(tag => {
            tagSet.add(tag);
        });
    });

    const tags = [...tagSet].sort();

    return (
        <div className="filter-panel">

            {/* Always visible */}
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
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            setFilters(prev =>
                                                prev.map((f, i) =>
                                                    i === index
                                                        ? {...f, operator: value}
                                                        : f
                                                )
                                            );
                                        }}
                                    >
                                        <option value="equals">equals</option>
                                        <option value="not_equals">
                                            not equals
                                        </option>
                                        <option value="exists">exists</option>
                                        <option value="missing">missing</option>
                                    </select>

                                    {filter.operator !== "exists" &&
                                        filter.operator !== "missing" && (
                                            <input
                                                type="text"
                                                value={filter.value}
                                                onChange={(e) => {
                                                    const newFilters = [...filters];
                                                    newFilters[index].value =
                                                        e.target.value;
                                                    setFilters(newFilters);
                                                }}
                                                placeholder="Value"
                                            />
                                        )}

                                    <button
                                        onClick={() =>
                                            setFilters(
                                                filters.filter(
                                                    (_, i) => i !== index
                                                )
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