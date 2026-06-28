/**
 * FilterPanel
 * -----------
 * UI container for the attribute-based filtering system.
 *
 * Responsibilities:
 * - Display active filters (FilterItem)
 * - Display available tags (TagItem)
 * - Control collapsed/expanded state
 * - Delegate data extraction to useFilterData hook
 */

import { useState } from "react";

import useFilterData from "./useFilterData";
import FilterItem from "./FilterItem";
import TagItem from "./TagItem";

import "./FilterPanel.css";

function FilterPanel({ features, filters, setFilters }) {
    const [collapsed, setCollapsed] = useState(true);

    const { tags, getValues } = useFilterData(features, filters);

    const toggleCollapsed = () => {
        setCollapsed(prev => !prev);
    };

    return (
        <div className={`filter-panel ${collapsed ? "collapsed" : "expanded"}`}>

            {/* Header */}
            <div className="filter-header" onClick={toggleCollapsed}>
                <h3>
                    Filter Panel
                    <span className={`arrow ${collapsed ? "" : "open"}`}>
                        ▴
                    </span>
                </h3>
            </div>

            {/* Content */}
            <div className={`filter-content-wrapper ${collapsed ? "collapsed" : "expanded"}`}>
                <div className={`filter-content ${collapsed ? "collapsed" : "expanded"}`}>

                    {/* Active Filters */}
                    {filters.length > 0 && (
                        <div className="active-filters">
                            <h4>Active Filters</h4>

                            {filters.map((filter, index) => (
                                <FilterItem
                                    key={filter.id ?? filter.key ?? index}
                                    filter={filter}
                                    index={index}
                                    setFilters={setFilters}
                                    getValues={getValues}
                                />
                            ))}
                        </div>
                    )}

                    {/* Available Tags */}
                    <h4>Available Tags</h4>

                    {tags.map(tag => (
                        <TagItem
                            key={tag}
                            tag={tag}
                            setFilters={setFilters}
                        />
                    ))}

                </div>
            </div>
        </div>
    );
}

export default FilterPanel;