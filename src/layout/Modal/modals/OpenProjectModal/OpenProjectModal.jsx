import './OpenProjectModal.css';
import { Trash2 } from 'lucide-react';

import { useState, useEffect } from 'react';

import Modal from '../../Modal';

import { getProjects, deleteProject } from '@/db/projectDB';
import { timeAgo } from '@/utils/timeAgo';

export default function OpenProjectModal({
	onOpen,
	onClose,
	onProjectDeleted,
}) {
	const [projects, setProjects] = useState([]);
	const hasSavedProjects = Object.keys(projects).length > 0;

	async function loadProjects() {
		const list = await getProjects(); // fetch projects from database

		// sort projects by date last modified
		const sorted = list.sort((a, b) => {
			return (
				new Date(b.metadata.modified) - new Date(a.metadata.modified)
			);
		});

		setProjects(sorted);
	}
	useEffect(() => {
		loadProjects();
	}, []);

	const confirmDelete = (project) => {
		if (window.confirm(`Delete "${project.metadata.name}"?`)) {
			handleDelete(project.metadata.id);
		}
	};

	async function handleDelete(id) {
		await deleteProject(id);

		onProjectDeleted(id);

		await loadProjects();
	}

	return (
		<Modal title="Open project" onClose={onClose}>
			<section className="modal-section">
				{!hasSavedProjects ? (
					<div className="no-projects">
						<p>No projects have been saved</p>
					</div>
				) : (
					<div className="project-list">
						{projects.map((project) => (
							<div
								key={project.metadata.id}
								className="project-item"
							>
								<button
									className="project-card"
									onClick={() => onOpen(project.metadata.id)}
								>
									<div className="project-card-content">
										<h3>{project.metadata.name}</h3>

										<div className="project-meta">
											<span>
												{project?.boundary.data
													.elements?.[0]?.tags
													?.name ?? 'None'}
											</span>
										</div>

										{project.metadata.description && (
											<p className="project-description">
												{project.metadata.description}
											</p>
										)}

										<span className="project-updated">
											<strong>Last modified: </strong>
											{timeAgo(
												project?.metadata.modified
											)}
										</span>
									</div>
								</button>
								<button
									className="project-card-delete"
									onClick={() => confirmDelete(project)}
									aria-label={`Delete ${project.metadata.name}`}
								>
									<Trash2 size={22} />
								</button>
							</div>
						))}
					</div>
				)}
			</section>
		</Modal>
	);
}
