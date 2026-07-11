import './Sidebar.css';

/* UI COMPONENTS */
import SidebarHeader from './components/SidebarHeader'
import SidebarButton from './components/SidebarButton'

import FeatureCounter from '../../components/FeatureCounter/FeatureCounter';
import BoundaryIndicator from '../../components/BoundaryIndicator/BoundaryIndicator';

/* CONSTANTS */
import GROUP_LABELS from '../Drawer/panels/LayersPanel/constants/featureGroups'

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

    activeDrawer,
    setActiveDrawer
}) =>{

    const openDrawer = (name) => {
        setActiveDrawer(prev =>
            prev === name ? null : name
        );
    };

    const hasBoundary = !!boundaryData;
    const hasFeatures = !!featureData;

    return (
        <div className="sidebar-content">

            <SidebarButton
                label="Boundary"
                active={activeDrawer === "boundary"}
                onClick={() => openDrawer("boundary")}
            />

            <SidebarButton
                label="Layers"
                disabled={!hasBoundary}
                active={activeDrawer === "layers"}
                onClick={() =>{openDrawer("layers")}
                } 
            />

            <SidebarButton
                label="Display"
                disabled={!hasFeatures}
                active={activeDrawer === "display"}
                onClick={() => openDrawer("display")}
            />
        </div>
    );
}

export default Sidebar;