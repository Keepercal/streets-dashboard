import './OpenProjectModal.css';

import { useState, useEffect } from 'react';

import Modal from '../Modal';
import { getProjects } from '../../../db/projectDB';

export default function OpenProjectModal({ onOpen, onClose }) {
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		async function loadProjects() {
			const list = await getProjects();
			setProjects(list);
		}

		loadProjects();
	}, []);

	return (
		<Modal title="Open project" onClose={onClose}>
			{projects.map((project) => (
				<button
					key={project.metadata.id}
					onClick={() => onOpen(project.metadata.id)}
				>
					<h3>{project.metadata.name}</h3>
					<p>{project.metadata.description}</p>
				</button>
			))}
		</Modal>
	);
}
