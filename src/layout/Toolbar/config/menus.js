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
				action: 'modal',
			},
			{
				id: 'open',
				label: 'Open Project',
				modal: 'open-project',
				action: 'modal',
			},
			/*{
				id: 'save',
				label: 'Save',
				action: 'save',
				requires: 'canSave',
			}*/
			{
				id: 'save-as',
				label: 'Save As...',
				modal: 'save-project',
				action: 'modal',
				requires: 'canSave',
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
				action: 'modal',
			},
		],
	},
];
