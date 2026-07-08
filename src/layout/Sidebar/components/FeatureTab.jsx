import '../Sidebar.css'
import ToggleItem from './ToggleItem';

/**
 * FeatureTab.jsx
 * ------------
 * UI component in sidebar which contains feature options
 *
 * Features:
 * - Load features from a preselect list
 */
const FeatureTab = ({
    open,
    setOpen,

    openGroups,
    groupedFeatures,
    toggleGroup,
    GROUP_LABELS,
    toggles,
    handleToggle
}) => (
    <div className={`sidebar-tab ${open ? "is-open" : ""}`}>

        <h3
            className="tab-header"
            onClick={() => setOpen(prev => !prev)}
        >
            Load Features
            <span className={`arrow ${open ? "rotated" : ""}`}>▸</span>
        </h3>

        {/* LEVEL 1: FEATURES PANEL */}
        <div className={`tab-content ${open ? "open" : ""}`}>

            {Object.entries(groupedFeatures).map(([group, features]) => (

                <div key={group} className="accordion-group">

                    {/* LEVEL 2 HEADER */}
                    <h4
                        className="accordion-header"
                        onClick={() => toggleGroup(group)}
                    >
                        {GROUP_LABELS[group] || group}
                        <span className={`arrow ${openGroups[group] ? "rotated" : ""}`}>▸</span>
                    </h4>

                    {/* LEVEL 3 CONTENT */}
                    <div className={`accordion-content ${openGroups[group] ? "open" : ""}`}>

                        {features.map(({ key, label, tag, type }) => (
                            <ToggleItem
                                key={key}
                                label={label}
                                checked={toggles[key]}
                                onChange={() =>
                                    handleToggle(key, tag, key, type)
                                }
                            />
                        ))}

                    </div>

                </div>
            ))}
        </div>
    </div>
)

export default FeatureTab;
