import './NewProjectModal.css';

import Modal from '../Modal';

import FormInput from '../components/FormInput/FormInput';

export default function NewProjectModal({
	isDirty,
	onClose,
	onCreate,
	onSaveAndCreate,
}) {
	return (
		<Modal title="New Project" onClose={onClose}>
			<section className="project-section">
				<h3>
					{isDirty
						? 'Save changes before starting a new project?'
						: 'Start a new project session?'}
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
						<button className="primary-btn" onClick={onCreate}>
							Start New Session
						</button>
					</>
				)}

				{isDirty && (
					<>
						<button
							className="primary-btn"
							onClick={onSaveAndCreate}
						>
							Save & Continue
						</button>

						<button className="primary-btn" onClick={onCreate}>
							Discard Changes
						</button>
					</>
				)}
			</section>
		</Modal>
	);
}
