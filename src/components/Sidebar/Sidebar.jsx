import './Sidebar.css';
import { useState, useEffect, useMemo } from "react";
import DropdownItem from './DropdownItem';
import ToggleItem from './ToggleItem';

const Sidebar = ({
    handleDropdown,
    handleToggle,
    boundaryData,
    selectedBoundary,
    toggles,
    boundaryOptions,
    featureOptions
}) => {

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

                <h2>Select Boundary</h2>

                <DropdownItem
                    selectedBoundary={selectedBoundary}
                    boundaryOptions={boundaryOptions}
                    onChange={(boundaryKey) => {
                        console.log(boundaryOptions)
                        const selected = boundaryOptions.find( // Looks up boundary in an array 
                            opt => opt.key === boundaryKey // SHOULD BE LOOKUP UP WITH KEY // opt.key === boundaryKey
                        );

                        handleDropdown(
                            boundaryKey,
                            selected?.boundaryType,
                            selected?.name,
                        );
                    }}
                />

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
                                        className={`arrow ${
                                            openGroups[group] ? "rotated" : ""
                                        }`}
                                    >
                                        ▸
                                    </span>
                                </h3>

                                <div
                                    className={`group-content ${
                                        openGroups[group] ? "open" : ""
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