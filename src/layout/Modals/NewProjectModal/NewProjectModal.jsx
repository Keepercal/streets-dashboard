import './NewProjectModal.css';

import Modal from '../Modal';

import FormInput from '../components/FormInput/FormInput';

export default function NewProjectModal({
	isDirty,
	onClose,
	onConfirm,
	onSaveAndConfirm,
}) {
	return (
		<Modal title="New Workspace" onClose={onClose}>
			<section className="project-section">
				<h3>
					{isDirty
						? 'Save changes before starting a new workspace?'
						: 'Start a new workspace?'}
				</h3>
				<p>
					{isDirty
						? 'You have unsaved changes in the current session'
						: 'This will clear the current working session'}
				</p>
			</section>

			<section className="project-actions">
				<button className="secondary-btn" onClick={onClose}>
					Cancel
				</button>

				{!isDirty && (
					<>
						<button className="primary-btn" onClick={onConfirm}>
							Start New Workspace
						</button>
					</>
				)}

				{isDirty && (
					<>
						<button
							className="primary-btn-discard"
							onClick={onConfirm}
						>
							Discard Changes
						</button>
						<button
							className="primary-btn"
							onClick={onSaveAndConfirm}
						>
							Save & Continue
						</button>
					</>
				)}
			</section>
		</Modal>
	);
}
