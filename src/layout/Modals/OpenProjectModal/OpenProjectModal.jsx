import './OpenProjectModal.css';
import { Trash2 } from 'lucide-react';

import { useState, useEffect } from 'react';

import Modal from '../Modal';
import { getProjects, deleteProject } from '../../../db/projectDB';

export default function OpenProjectModal({
	onOpen,
	onClose,
	onProjectDeleted,
}) {
	const [projects, setProjects] = useState([]);

	async function loadProjects() {
		const list = await getProjects();
		setProjects(list);
	}
	useEffect(() => {
		loadProjects();
	}, []);

	async function handleDelete(id) {
		await deleteProject(id);

		onProjectDeleted(id);

		await loadProjects();
	}

	return (
		<Modal title="Open project" onClose={onClose}>
			{projects.map((project) => (
				<div className="project-item">
					<button
						key={project.metadata.id}
						onClick={() => onOpen(project.metadata.id)}
					>
						<h3>{project.metadata.name}</h3>
						<p>{project.metadata.description}</p>
					</button>
					<button onClick={() => handleDelete(project.metadata.id)}>
						<Trash2 />
					</button>
				</div>
			))}
		</Modal>
	);
}
