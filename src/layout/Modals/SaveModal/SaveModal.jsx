import './SaveModal.css';
import { useState } from 'react';

import Modal from '../Modal';

import FormInput from '../components/FormInput/FormInput';

export default function SaveModal({ onClose, onSaveAs }) {
	const [projectName, setProjectName] = useState('');
	const [projectDescription, setProjectDescription] = useState('');

	const handleCreate = () => {
		const name = projectName.trim() || 'Untitled Project';
		const description = projectDescription || '';

		onSaveAs(name, description);
		onClose();
	};

	return (
		<Modal title="Save Project" onClose={onClose}>
			<section className="project-section">
				<h3>Project Details</h3>

				<div className="project-metadata">
					<FormInput
						label="Project Name"
						value={projectName}
						onChange={(e) => setProjectName(e.target.value)}
						placeholder="Untitled Project"
					/>

					<FormInput
						label="Description"
						type="textarea"
						value={projectDescription}
						onChange={(e) => setProjectDescription(e.target.value)}
						placeholder="Describe your project (optional)"
					/>
				</div>
			</section>

			<section className="project-actions">
				<button className="secondary-btn" onClick={onClose}>
					Cancel
				</button>

				<button className="primary-btn" onClick={handleCreate}>
					Save Project
				</button>
			</section>
		</Modal>
	);
}
