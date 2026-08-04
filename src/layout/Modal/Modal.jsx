import './Modal.css';

export default function Modal({
	title,
	type,
	children,
	onClose,
	canClose = true,
	varient,
}) {
	return (
		<div className="modal-overlay">
			<div className={`modal modal--${varient}`}>
				<div className="modal-header">
					<h3 className={`modal-title ${type || ''}`}>{title}</h3>
					{canClose && (
						<button className="modal-close" onClick={onClose}>
							×
						</button>
					)}
				</div>

				<div className="modal-content">{children}</div>
			</div>
		</div>
	);
}
