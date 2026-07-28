import './ToolbarButton.css';

export default function ToolbarButton({
	title,
	icon,
	indicator = false,
	onClick,
	disabled = false,
}) {
	return (
		<button
			className="toolbar-button"
			disabled={disabled}
			onClick={onClick}
		>
			{title}
			{icon}
			{indicator && <span className="toolbar-button-indicator" />}
		</button>
	);
}
