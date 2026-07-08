import { BarLoader } from "react-spinners";
import Popup from '../Popup'

/**
 * StatusPopup
 * ----------------
 * Displays application status messages:
 * - loading states
 * - errors
 * - alerts
 */
export default function StatusPopup({
    trigger,
    type,
    title,
    message,
    onClose,
    children,
}) {
    if (!trigger) return null;

    return (
        <Popup
            title={title}
            type={type}
            onClose={onClose}
        >

            {message && (
                <p className={`popup-message ${type}`}>
                    {message}
                </p>
            )}


            {type === "loading" && (
                <div className="popup-loader">
                    <BarLoader />
                </div>
            )}

            {children}

        </Popup>
    );
}