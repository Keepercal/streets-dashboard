import '../Sidebar.css'
import RadioItem from './RadioItem';

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
}) => (
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

        <div className={`tab-content ${open ? "open" : ""}`}>
            <RadioItem
                label="Default"
                value="default"
                selected={displayMode}
                onChange={setDisplayMode}
            />
            <RadioItem
                label="Style by last edit"
                value="lastEdited"
                selected={displayMode}
                onChange={setDisplayMode}
            />
        </div>
    </div>
)

export default DisplayTab;
