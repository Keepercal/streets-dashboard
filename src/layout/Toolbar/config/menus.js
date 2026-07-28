import { CirclePlus } from 'lucide-react';

/* Config object */
export const menus = [
	{
		id: 'file',
		title: 'File',
		items: [
			{
				id: 'new-project',
				label: 'New Session',
				icon: CirclePlus,
				modal: 'new-project',
			},
			{
				id: 'open',
				label: 'Open Project',
				modal: 'open-project',
			},
			{
				id: 'save',
				label: 'Save',
			},
			{
				id: 'save-as',
				label: 'Save As...',
				modal: 'save-project',
			},
		],
	},
	{
		id: 'help',
		title: 'Help',
		items: [
			{
				id: 'about',
				label: 'About',
				disabled: true,
				modal: 'about',
			},
		],
	},
];
