import "./Legend.css";

const legendItems = [
    {
        label: "< 1 year",
        icon: "./assets/pins/pinGreen.svg"
    },
    {
        label: "1–3 years",
        icon: "./assets/pins/pinYellow.svg"
    },
    {
        label: "3+ years",
        icon: "./assets/pins/pinRed.svg"
    }
];

/**
 * Legend
 * ------
 * Displays a map legend explaining pin colors based on "last edited" age.
 */
function Legend() {
    return (
        <div className="legend">
            <div className="legend-content">
                <h3>Last Edited</h3>

                {legendItems.map((item) => (
                    <div key={item.label} className="legend-item">
                        <img src={item.icon} alt={item.label} />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Legend;