import "./ToolbarButton.css";

export default function ToolbarButton({
    title,
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
        </button>
    );
}