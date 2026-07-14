import "./ToolbarButton.css";

export default function ToolbarButton({
    title,
    icon,
    onClick,
    disabled = false
}) {

    return (
        <button
            className="toolbar-button"
            disabled={disabled}
            onClick={onClick}
        >
            {title}
            {icon}
        </button>
    );
}