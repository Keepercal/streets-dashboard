import './Sidebar.css';
import { useState, useEffect, useMemo } from "react";
import DropdownItem from './DropdownItem';
import ToggleItem from './ToggleItem';
import InputItem from '../BoundarySearch/InputItem';

const Sidebar = ({
    handleToggle,
    boundaryData,
    selectedBoundary,
    toggles,
    featureOptions,
    searchBoundaries,
    boundaryResults,
    onSelectBoundary,
}) => {

    const [boundaryOpen, setBoundaryOpen] = useState(false);
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
        <div className="sidebar">
            <div className="sidebar-header">
                <h1 className="sidebar-title">{window.APP_NAME}</h1>
                <p className="version-tag">{window.APP_VERSION}</p>

                <div className="boundary-section">
                    <div
                        className="groupHeader"
                        onClick={() => setBoundaryOpen(prev => !prev)}
                    >
                        <h2>Search Boundary</h2>

                        <span className={`arrow ${boundaryOpen ? "rotated" : ""}`}>
                            ▸
                        </span>
                    </div>

                    <div className={`group-content ${boundaryOpen ? "open" : ""}`}>
                        <InputItem
                            searchBoundaries={searchBoundaries}
                        />

                        <div className="sidebar-content">
                            {boundaryResults?.map(result => (
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

                <div className="sidebar-content">
                    {boundaryData &&
                        Object.entries(groupedFeatures).map(([group, features]) => (
                            <div key={group}>
                                <h3
                                    className="group-header"
                                    onClick={() => toggleGroup(group)}
                                >
                                    {GROUP_LABELS[group] || group}
                                    <span
                                        className={`arrow ${openGroups[group] ? "rotated" : ""
                                            }`}
                                    >
                                        ▸
                                    </span>
                                </h3>

                                <div
                                    className={`group-content ${openGroups[group] ? "open" : ""
                                        }`}
                                >
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
        </div>
    );
};

export default Sidebar;