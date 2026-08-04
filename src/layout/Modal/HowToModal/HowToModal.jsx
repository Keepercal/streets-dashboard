import './HowToModal.css';
import { useState } from 'react';

import Modal from '../Modal';

import GettingStartedPage from './pages/GettingStartedPage';
import AddingLayersPage from './pages/AddingLayersPage';
import ManagingLayersPage from './pages/ManagingLayersPage';
import DisplaySettingsPage from './pages/DisplaySettingsPage';
import SaveOpenProjectPage from './pages/SaveOpenProjectPage';
import ExportProjectPage from './pages/ExportProjectPage';

export default function HowToModal({ onClose }) {
	const pages = [
		{
			id: 'getting-started',
			title: 'Getting Started',
			component: <GettingStartedPage />,
		},
		{
			id: 'adding-layers',
			title: 'Adding Layers',
			component: <AddingLayersPage />,
		},
		{
			id: 'managing-layers',
			title: 'Managing Layers',
			component: <ManagingLayersPage />,
		},
		{
			id: 'display-settings',
			title: 'Display Settings',
			component: <DisplaySettingsPage />,
		},
		{
			id: 'save-open-project',
			title: 'Saving & Loading Projects',
			component: <SaveOpenProjectPage />,
		},
		{
			id: 'export-project',
			title: 'Exporting Projects',
			component: <ExportProjectPage />,
		},
	];

	const [activePage, setActivePage] = useState('getting-started');
	const currentPage = pages.find((page) => page.id === activePage);

	return (
		<Modal
			title={`How to use ${__APP_NAME__}`}
			onClose={onClose}
			canClose={true}
			varient="how-to"
		>
			<div className="how-to-layout">
				<nav className="how-to-nav">
					{pages.map((page) => (
						<button
							key={page.id}
							className={activePage === page.id ? 'active' : ''}
							onClick={() => setActivePage(page.id)}
						>
							{page.title}
						</button>
					))}
				</nav>

				<section className="how-to-content">
					{currentPage.component}
				</section>
			</div>
		</Modal>
	);
}
