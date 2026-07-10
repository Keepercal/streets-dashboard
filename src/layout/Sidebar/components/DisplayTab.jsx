import '../Sidebar.css'
import RadioItem from './RadioItem';

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
const DisplayTab = ({
    open,
    setOpen,
    disabled,

    displayMode,
    setDisplayMode
}) => {
    return(
        <div className={`sidebar-tab ${open ? "is-open" : ""} ${disabled ? "disabled" : ""}`}>

            <h3
                className="tab-header"
                onClick={() => {
                    if (!disabled) {
                        setOpen(prev => !prev);
                    }
                }}
            >
                Display
                <span className={`arrow ${open ? "rotated" : ""}`}>▸</span>
            </h3>

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

export default DisplayTab;
