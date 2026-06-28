import './BoundarySearch.css';
import { useState, useEffect, useMemo } from "react";
import DropdownItem from '../Sidebar/DropdownItem';
import ToggleItem from '../Sidebar/ToggleItem';
import InputItem from './InputItem';

const BoundarySearch = ({
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

                <h2>Search Boundary</h2>

                <InputItem/>

                <div className="sidebar-content">

                </div>
            </div>
        </div>
    );
};

export default BoundarySearch;