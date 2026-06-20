import './Sidebar.css';
import { useState, useEffect, useMemo } from "react";

const DropdownItem = ({ value, options, onChange }) => {
    return (
        <div className="dropdown-item">
            <label>
                <select
                    className="dropdown-btn"
                    value={value} onChange={(e) => onChange(e.target.value)}
                >
                    {(options || []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
};

const ToggleItem = ({ label, checked, onChange }) => {
    return (
        <div className="toggle-item">
            <label>
                <input
                    type="checkbox"
                    checked={!!checked}
                    onChange={onChange}
                />
                {label}
            </label>
        </div>
    );
};

const Sidebar = ({
    handleDropdown,
    handleToggle, boundaryData,
    selectedBoundary, toggles,
    boundaryOptions,
    featureOptions
}) => {

    const [openGroups, setOpenGroups] = useState({});

    const GROUP_LABELS = { // WHEN ADDING NEW GROUP TO FEATURE MAP, ADD CUSTOM HEADER HERE!!!
        networks: "Networks",
        ways: "Ways",
        crossings: "Crossings",
        publicTransport: "Public Transport",
        publicServices: "Public Services",
        streetFurniture: "Street Furniture",
        poi: "Points of Interest",
        buildings: "Buildings",
    };

    const groupedFeatures = useMemo(() => {
        return Object.entries(featureOptions || {}).reduce(
            (acc, [key, feature]) => {
                const group = feature.group;

                if (!group){
                    console.warn("Feature missing group:", key, feature);
                    return acc;
                }

                if (!acc[group]) acc[group] = [];

                acc[group].push({ key, ...feature });

                return acc;
            },
            {}
        );
    }, [featureOptions]);

    useEffect(() => {
        if (!featureOptions) return;

        setOpenGroups(prev => {
            const groups = Object.values(featureOptions).reduce((acc, feature) => {

                if(!feature?.group) return acc;

                acc[feature.group] = false; // all closed initially
                return acc;
            }, {});

            return { ...groups, ...prev };
        });
    }, [featureOptions]);

    const toggleGroup = (group) => {
        setOpenGroups(prev => ({
            ...prev,
            [group]: !prev[group],
        }))
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1 className="sidebar-title">{window.APP_NAME}</h1>
                <p className="version-tag">{window.APP_VERSION}</p>

                <h2>Select Boundary</h2>

                {/* Create a dropdown feature to select a Boundary */}
                <DropdownItem
                    options={boundaryOptions}
                    value={selectedBoundary}
                    onChange={(value) => {
                        const selected = boundaryOptions.find(opt => opt.value === value);
                        handleDropdown(value, value, selected?.boundaryType, selected?.boundaryName);
                    }}
                />

                {/* Show the list of options if a Boundary is returned and the Overpass API returned the Ward boundary */}
                <div className="sidebar-content">
                    {boundaryData &&
                        Object.entries(groupedFeatures).map(([group, features]) => (
                            <div key={group}>
                                <h3
                                    className="group-header"
                                    onClick={() => toggleGroup(group)}
                                >
                                    {GROUP_LABELS[group] || group}{" "}
                                    <span
                                        className={`arrow ${openGroups[group] ? "rotated" : ""}`}
                                    >
                                        ▸
                                    </span>
                                </h3>

                                <div
                                    className={`group-content ${openGroups[group] ? "open" : ""}`}
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
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Sidebar;