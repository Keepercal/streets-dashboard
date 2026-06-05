import "./Legend.css";

const Legend = () => {
    return (
        <div className="legend">
            <div className="legend-content">
                <h3>Last Edited</h3>
                <div className="legend-item">
                    <img src="./assets/pins/pinGreen.svg" alt="" />
                    <span>&lt; 1 year</span>
                </div>
                <div className="legend-item">
                    <img src="./assets/pins/pinYellow.svg" alt="" />
                    <span>1-3 years</span>
                </div>
                <div className="legend-item">
                    <img src="./assets/pins/pinRed.svg" alt="" />
                    <span>3+ years</span>
                </div>
            </div>
        </div>
    );
};

export default Legend;
