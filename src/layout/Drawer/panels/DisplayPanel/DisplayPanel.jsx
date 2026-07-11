import RadioItem from '../../../../components/RadioItem/RadioItem.jsx';

const displayModeLabels = {
    default: "Default",
    lastEdited: "By Last Edit"
}

/**
 * Display.jsx
 * ------------
 * Change how content is shown on the map
 *
 * - Default
 * - Days since last edit
 */
const DisplayPanel = ({
    disabled,

    displayMode,
    setDisplayMode
}) => {
    return(
        <div className={`panel-content ${open ? "is-open" : ""} ${disabled ? "disabled" : ""}`}>

            <p className="current-display-indicator">Current: {displayModeLabels[displayMode]}</p>

            <div className={`tab-content ${open ? "open" : ""}`}>
                <p>Style map content:</p>
                <RadioItem
                    label="Default"
                    value="default"
                    selected={displayMode}
                    onChange={setDisplayMode}
                />
                <RadioItem
                    label="By Last Edit"
                    value="lastEdited"
                    selected={displayMode}
                    onChange={setDisplayMode}
                />
            </div>
        </div>
    )}

export default DisplayPanel;
