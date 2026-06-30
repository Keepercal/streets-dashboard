import './Sidebar.css';
import { useState, useEffect, useMemo } from "react";
import ToggleItem from './components/ToggleItem';
import InputItem from './components/InputItem';

/* UI Components */
import SidebarHeader from './components/SidebarHeader'
import BoundaryTab from './components/BoundaryTab';
import FeatureTab from './components/FeatureTab';
import FeatureCounter from '../../components/FeatureCounter/FeatureCounter';

const Sidebar = ({
    boundaryData,
    featureData,

    searchBoundaries,
    handleSelectBoundary,
    boundaryResults,
    selectedBoundaryKey,

    featureOptions,
    toggles,
    handleToggle,

    handleClearBoundary,
    clearFeatures,
}) =>{

    const [boundaryOpen, setBoundaryOpen] = useState(false);
    const [featuresOpen, setFeaturesOpen] = useState(false);
    const [openGroups, setOpenGroups] = useState({});
    const [hasSearched, setHasSearched] = useState(false);

    /**
     * Human-readable group labels
     */
    const GROUP_LABELS = {
        networks: "Networks",
        ways: "Ways",
        crossings: "Crossings",
        transport: "Transport",
        publicServices: "Public Services",
        streetFurniture: "Street Furniture",
        poi: "Points of Interest",
        fooddrink: "Food & Drink",
        leisure: "Leisure",
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
        setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
    };

    return (
        <div className="sidebar-wrapper">
            <div className="sidebar">

                {/* ================= HEADER ================= */}
                <SidebarHeader/>

                {/* ================= BOUNDARY ================= */}
                <BoundaryTab
                    open={boundaryOpen}
                    setOpen={setBoundaryOpen}

                    searchBoundaries={searchBoundaries}
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
                        openGroups={openGroups}
                        featuresOpen={featuresOpen}
                        setFeaturesOpen={setFeaturesOpen}
                        groupedFeatures={groupedFeatures}
                        toggleGroup={toggleGroup}
                        GROUP_LABELS={GROUP_LABELS}
                        toggles={toggles}
                        handleToggle={handleToggle}
                    />
                )}
                <FeatureCounter features={featureData} />
            </div>
        </div>
    );
}

export default Sidebar;