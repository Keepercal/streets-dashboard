import { CirclePlus } from 'lucide-react';

/* Config object */
export const menus = [
	{
		id: 'file',
		title: 'File',
		items: [
			{
				id: 'new-workspace',
				label: 'New Workspace',
				icon: CirclePlus,
				action: 'newWorkspace',
			},
			{
				id: 'open',
				label: 'Open Project',
				action: 'openProject',
			},
			{
				id: 'save-as',
				label: 'Save As...',
				action: 'modal',
				modal: 'saveProject',
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
