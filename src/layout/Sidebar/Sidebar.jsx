import './Sidebar.css';
import { useState, useEffect, useMemo } from "react";
import DropdownItem from './DropdownItem';
import ToggleItem from './ToggleItem';
import InputItem from './InputItem';

const Sidebar = ({
    handleToggle,
    boundaryData,
    toggles,
    featureOptions,
    searchBoundaries,
    clearBoundary,
    boundaryResults,
    onSelectBoundary,
}) => {

    const [boundaryOpen, setBoundaryOpen] = useState(false);
    const [featuresOpen, setFeaturesOpen] = useState(false);
    const [openGroups, setOpenGroups] = useState({});

    /**
     * Human-readable group labels
     */
    const GROUP_LABELS = {
        networks: "Networks",
        ways: "Ways",
        crossings: "Crossings",
        publicTransport: "Public Transport",
        publicServices: "Public Services",
        streetFurniture: "Street Furniture",
        poi: "Points of Interest",
        buildings: "Buildings",
        recreation: "Recreation",
        landuse: "Land Use",
    };

    /**
     * Group features by category
     */
    const groupedFeatures = useMemo(() => {
        return Object.entries(featureOptions || {}).reduce(
            (acc, [key, feature]) => {
                const group = feature.group;

                if (!group) return acc;

                if (!acc[group]) acc[group] = [];

                acc[group].push({ key, ...feature });

                return acc;
            },
            {}
        );
    }, [featureOptions]);

    /**
     * Initialize group open/closed state
     */
    useEffect(() => {
        if (!featureOptions) return;

        setOpenGroups((prev) => {
            const initial = Object.values(featureOptions).reduce(
                (acc, feature) => {
                    if (feature?.group) {
                        acc[feature.group] = false;
                    }
                    return acc;
                },
                {}
            );

            return { ...initial, ...prev };
        });
    }, [featureOptions]);

    /**
     * Toggle group visibility
     */
    const toggleGroup = (group) => {
        setOpenGroups((prev) => ({
            ...prev,
            [group]: !prev[group],
        }));
    };
    return (
        <div className="sidebar-wrapper">
            <div className="sidebar">

                {/* ================= HEADER ================= */}
                <div className="sidebar-header">
                    <h1 className="sidebar-title">{window.APP_NAME}</h1>
                    <p className="version-tag">{window.APP_VERSION}</p>
                </div>

                {/* ================= BOUNDARY ================= */}
                <div className="sidebar-section">

                    <h3
                        className="section-header"
                        onClick={() => setBoundaryOpen(prev => !prev)}
                    >
                        Search Boundary
                        <span className={`arrow ${boundaryOpen ? "rotated" : ""}`}>▸</span>
                    </h3>

                    <div className={`section-content ${boundaryOpen ? "open" : ""}`}>

                        <div className="section-body">
                            <InputItem 
                                searchBoundaries={searchBoundaries} 
                                clearBoundary={clearBoundary}
                            />
                        </div>

                        <div className="section-list">
                            {boundaryResults?.map(result => (
                                <div
                                    key={result.place_id}
                                    className="boundary-card"
                                    onClick={() => onSelectBoundary(result)}
                                >
                                    {result.display_name}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* ================= FEATURES ================= */}
                {boundaryData && (
                    <div className="sidebar-section">

                        <h3
                            className="section-header"
                            onClick={() => setFeaturesOpen(prev => !prev)}
                        >
                            Features
                            <span className={`arrow ${featuresOpen ? "rotated" : ""}`}>▸</span>
                        </h3>

                        {/* LEVEL 1: FEATURES PANEL */}
                        <div className={`section-content ${featuresOpen ? "open" : ""}`}>

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
                )}

            </div>
        </div>
    );
}

export default Sidebar;