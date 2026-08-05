import './AboutModal.css';
import { useRef, useState, useEffect } from 'react';

import Modal from '../Modal';
import ModalNav from '../components/ModalNav/ModalNav';

const pages = [
	{
		id: 'overview',
		title: 'Overview',
		//component: ,
	},
];

export default function AboutModal({ onClose }) {
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
