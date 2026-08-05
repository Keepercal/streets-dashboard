import './HowToModal.css';
import { useRef, useState, useEffect } from 'react';

import Modal from '../Modal';
import ModalNav from '../components/ModalNav/ModalNav';

import GettingStartedPage from './pages/GettingStartedPage';
import AddingLayersPage from './pages/AddingLayersPage';
import ManagingLayersPage from './pages/ManagingLayersPage';
import DisplaySettingsPage from './pages/DisplaySettingsPage';
import SaveOpenProjectPage from './pages/SaveOpenProjectPage';
import ExportProjectPage from './pages/ExportProjectPage';

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

export default function HowToModal({ onClose }) {
	const [activePage, setActivePage] = useState('getting-started');
	const currentPage = pages.find((page) => page.id === activePage);
	const contentRef = useRef(null);

	useEffect(() => {
		contentRef.current?.scrollTo(0, 0);
	}, [activePage]);

	return (
		<Modal
			title={`How to use ${__APP_NAME__}`}
			onClose={onClose}
			canClose={true}
			variant="nav"
		>
			<div className="modal-nav-layout">
				<ModalNav
					items={pages}
					active={activePage}
					onChange={setActivePage}
				/>

				<section className="modal-nav-content" ref={contentRef}>
					{currentPage.component}
				</section>
			</div>
		</Modal>
	);
}
