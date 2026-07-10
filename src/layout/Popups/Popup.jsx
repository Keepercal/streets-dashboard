import './Popup.css'

export default function Popup({
    title,
    type,
    children,
    onClose,
}) {
    return (
        <div className="popup-overlay">

            <div className="popup">

                <div className="popup-header">
                    <h3 className={`popup-title ${type || ""}`}>
                        {title}
                    </h3>

                    <button
                        className="popup-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="popup-content">
                    {children}
                </div>

            </div>

        </div>
    );
}