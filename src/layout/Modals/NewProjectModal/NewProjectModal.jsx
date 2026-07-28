import './NewProjectModal.css';

import Modal from '../Modal';

import FormInput from '../components/FormInput/FormInput';

export default function NewProjectModal({ onClose, onCreate }) {
	return (
		<Modal title="New Project" onClose={onClose}>
			<section className="project-section">
				<h3>Start a new project?</h3>
				<p>This will clear the current working session</p>
			</section>

			<section className="project-actions">
				<button className="secondary-btn" onClick={onClose}>
					Cancel
				</button>

				<button className="primary-btn" onClick={onCreate}>
					Start New Project
				</button>
			</section>
		</Modal>
	);
}
