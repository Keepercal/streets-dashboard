import './Sidebar.css';

/* UI COMPONENTS */
import InputItem from './components/InputItem';
import ToggleItem from './components/ToggleItem';

import SidebarHeader from './components/SidebarHeader'
import BoundaryTab from './components/BoundaryTab';
import FeatureTab from './components/FeatureTab';
import FeatureCounter from '../../components/FeatureCounter/FeatureCounter';

/* CONSTANTS */
import GROUP_LABELS from './constants/featureGroups'

/* HOOKS */
import { useState } from "react";
import useFeatureGroups from './hooks/useFeatureGroups';

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

    const [activeTab, setActiveTab] = useState("boundary"); // Start with boundary select open
    const [hasSearched, setHasSearched] = useState(false);

    const {
        groupedFeatures,
        openGroups,
        toggleGroup
    } = useFeatureGroups(featureOptions);

    /* Toggle tab open/closed */
    const handleTabChange = (tab) => {
        setActiveTab(prev =>
            prev === tab ? null : tab
        );
    };

    return (
        <div className="sidebar-content">

            {/* ================= HEADER ================= */}
            {/*<SidebarHeader/>*/}

            {/* ================= BOUNDARY ================= */}
            <BoundaryTab
                open={activeTab === "boundary"}
                setOpen={() => handleTabChange("boundary")}

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
                    open={activeTab === "features"}
                    setOpen={() => handleTabChange("features")}
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