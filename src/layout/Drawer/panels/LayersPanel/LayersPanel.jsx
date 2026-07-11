import './LayersPanel.css'

import CheckboxItem from '../../../../components/CheckboxItem/CheckboxItem.jsx';

/* HOOKS */
import useFeatureGroups from './hooks/useFeatureGroups';

/* CONSTANTS */
import GROUP_LABELS from './constants/featureGroups'

/**
 * LayersPanel.jsx
 * ------------
 * UI component in sidebar which contains feature options
 *
 * Features:
 * - Load features from a preselect list
 */
const LayersPanel = ({
    featureOptions,

    toggles = {},
    handleToggle
}) => {

    const {
        groupedFeatures,
        openGroups,
        toggleGroup
    } = useFeatureGroups(featureOptions);

    return (
        <>
            <div className="panel-body">

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

                            {features?.map(({ key, label, tag, type }) => (
                                <CheckboxItem
                                    key={key}
                                    label={label}
                                    checked={!!toggles[key]}
                                    onChange={() =>
                                        handleToggle?.(key, tag, key, type)
                                    }
                                />
                            ))}

                        </div>

                    </div>
                ))}
            </div>
        </>
    )
}

export default LayersPanel;
