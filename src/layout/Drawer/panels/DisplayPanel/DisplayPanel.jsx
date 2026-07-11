import './DisplayPanel.css'
import RadioItem from '../../../../components/RadioItem/RadioItem.jsx';

const displayModeLabels = {
    default: "Default",
    lastEdited: "By Last Edit"
}

/**
 * Display.jsx
 * ------------
 * Change how map layers are presented
 *
 * - Default
 * - Days since last edit
 */
const DisplayPanel = ({
    displayMode,
    setDisplayMode
}) => {
    return(
        <div className="panel-body">

            <p className="current-display-indicator">Current: {displayModeLabels[displayMode]}</p>


            <div className="panel-content">
                <h3>
                    Style map content:
                </h3>

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
