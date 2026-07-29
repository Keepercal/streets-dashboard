import './RestoreSessionModal.css';

import Modal from '../Modal';

import FormInput from '../components/FormInput/FormInput';

export default function RestoreSessionModal({
	onRestore,
	onStartNew,
	onClose,
}) {
	return (
		<Modal title="New Workspace" onClose={onClose}>
			<section className="project-section">
				<h3>
					A previous session was found. Would you like to restore it?
				</h3>
			</section>

			<section className="project-actions">
				<button className="primary-btn" onClick={onStartNew}>
					Start New Session
				</button>
				<button className="primary-btn" onClick={onRestore}>
					Restore Session
				</button>
			</section>
		</Modal>
	);
}
