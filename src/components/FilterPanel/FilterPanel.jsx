import { useState } from 'react';
import './FilterPanel.css';

function FilterPanel({ features }) {
    const [collapsed, setCollapsed] = useState(true);

    const tagSet = new Set();

    features?.features?.forEach(feature => {
        const tags = feature.properties || {};

        Object.keys(tags).forEach(tag => {
            tagSet.add(tag);
        });
    });

    const tags = [...tagSet].sort();

    return (
        <div className="filter-panel">
            {!collapsed && (
                <div className="filter-content">
                    {tags.map(tag => (
                        <label key={tag} className="filter-item">
                            <br></br>
                            {tag}
                        </label>
                    ))}
                </div>
            )}
            <div
                className="filter-header"
                onClick={() => setCollapsed(!collapsed)}
            >
                <h3>Filter Panel {collapsed ? "▸" : "▾"}</h3>
            </div>
        </div>
    );
}

export default FilterPanel;