import './StatusPopup.css';
import { BarLoader } from "react-spinners";

/**
 * Popup component
 * ----------------
 * Generic modal popup used for:
 * - loading states
 * - alerts
 * - custom content injection (children)
 */
function StatusPopup({
    trigger,
    type,
    title,
    message,
    onClose,
    children
}) {
    if (!trigger) return null;

    return (
        <div className="popup">
            <div className="popup-inner">

                {/* Close button */}
                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    Close
                </button>

                {/* Title */}
                {title && (
                    <h3 className={`popup-title ${type}`}>
                        {title}
                    </h3>
                )}

                {/* Message */}
                {message && (
                    <p className={`popup-message ${type}`}>
                        {message}
                    </p>
                )}

                {/* Loading state */}
                {type === "loading" && (
                    <div className="popup-loader">
                        <BarLoader />
                    </div>
                )}

                {/* Custom content */}
                {children}

            </div>
        </div>
    );
}

export default StatusPopup;