import './Sidebar.css';
import { useState, useEffect, useMemo } from "react";

/* UI Components */
import InputItem from './components/InputItem';
import ToggleItem from './components/ToggleItem';

import SidebarHeader from './components/SidebarHeader'
import BoundaryTab from './components/BoundaryTab';
import FeatureTab from './components/FeatureTab';
import FeatureCounter from '../../components/FeatureCounter/FeatureCounter';

/**
 * Sidebar.jsx
 * ------------
 * UI component to toggle data onto map
 *
 * Features:
 * - Select a boundary
 * - Load features from a preselect list
 */
const Sidebar = ({
    boundaryData,
    featureData,

    loadBoundaryResults,
    handleSelectBoundary,
    boundaryResults,
    selectedBoundaryKey,

    featureOptions,
    toggles,
    handleToggle,

    handleClearBoundary,
    clearFeatures,
}) =>{

    const [openTab, setOpenTab] = useState("boundary"); // Start with boundary select open
    const [openGroups, setOpenGroups] = useState({});
    const [hasSearched, setHasSearched] = useState(false);

    /* Toggle tab open/closed */
    const toggleTab = (tab) => {
        setOpenTab(prev => 
            prev === tab ? null : tab
        );
    };

    /* Human-readable group labels */
    const GROUP_LABELS = {
        networks: "Networks",
        vehicle_highways: "Vehicle Highways",
        active_travel_highways: "Active Travel Highways",
        crossings: "Crossings",
        transport: "Transport",
        driving: "Driving",
        cycling: "Cycling",
        healthcare: "Healthcare",
        emergency: "Emergency",
        education: "Education",
        publicServices: "Public Services",
        streetFurniture: "Street Furniture",
        poi: "Points of Interest",
        shopping: "Shopping",
        fooddrink: "Food & Drink",
        leisure: "Leisure",
        tourism: "Tourism",
        accommodation: "Accommodation",
        landuse: "Land Use",
        buildings: "Buildings",
        naturalFeatures: "Natural Features"
    };

    /* Group features by category */
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

    /* Initialize group open/closed state */
    useEffect(() => {
        if (!featureOptions) return;

        setOpenGroups((prev) => {
            const initial = Object.values(featureOptions).reduce((acc, feature) => {
                    if (feature?.group) acc[feature.group] = false;

                    return acc;
                }, {});
            return { ...initial, ...prev };
        });
    }, [featureOptions]);

    /**
     * Toggle group visibility
     */
    const toggleGroup = (group) => {
        setOpenGroups((prev) => ({ 
            //...prev, // impacts whether more than one accordian can be open at the same time
            [group]: !prev[group] 
        }));
    };

    return (
        <div className="sidebar-content">

            {/* ================= HEADER ================= */}
            {/*<SidebarHeader/>*/}

            {/* ================= BOUNDARY ================= */}
            <BoundaryTab
                open={openTab === "boundary"}
                setOpen={() => toggleTab("boundary")}

                loadBoundaryResults={loadBoundaryResults}
                handleClearBoundary={handleClearBoundary}
                clearFeatures={clearFeatures}

                boundaryResults={boundaryResults}
                onSelectBoundary={handleSelectBoundary}

                selectedBoundaryKey={selectedBoundaryKey}

                hasSearched={hasSearched}
                setHasSearched={setHasSearched}
            />

            {/* ================= FEATURES ================= */}
            {boundaryData && (
                <FeatureTab
                    open={openTab === "features"}
                    setOpen={() => toggleTab("features")}
                    openGroups={openGroups}

                    GROUP_LABELS={GROUP_LABELS}
                    groupedFeatures={groupedFeatures}
                    toggleGroup={toggleGroup}

                    toggles={toggles}
                    handleToggle={handleToggle}
                />
            )}

            <FeatureCounter features={featureData} />
        </div>
    );
}

export default Sidebar;