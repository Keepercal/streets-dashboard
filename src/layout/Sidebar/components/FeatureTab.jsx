import '../Sidebar.css'
import ToggleItem from './ToggleItem';

const FeatureTab = ({
    openGroups,
    setFeaturesOpen,
    featuresOpen,
    groupedFeatures,
    toggleGroup,
    GROUP_LABELS,
    toggles,
    handleToggle
}) => (
    <div className={`sidebar-tab ${featuresOpen ? "is-open" : ""}`}>

        <h3
            className="tab-header"
            onClick={() => setFeaturesOpen(prev => !prev)}
        >
            Features
            <span className={`arrow ${featuresOpen ? "rotated" : ""}`}>▸</span>
        </h3>

        {/* LEVEL 1: FEATURES PANEL */}
        <div className={`tab-content ${featuresOpen ? "open" : ""}`}>

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
