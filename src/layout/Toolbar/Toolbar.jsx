/* Style/UI */
import './Toolbar.css';
import { Download, CirclePlus, Save } from 'lucide-react';

/* Components */
import ToolbarBrand from './components/ToolbarBrand/ToolbarBrand';
import ToolbarDropdown from './components/ToolbarDropdown/ToolbarDropdown';
import ToolbarButton from './components/ToolbarButton/ToolbarButton';
import BoundaryIndicator from '../../components/BoundaryIndicator/BoundaryIndicator';

/* Hooks */
import { useState, useRef } from 'react';
import { useClickOutside } from './hooks/useClickOutside';

/* Config */
import { menus } from './config/menus';

export default function Toolbar({
	onOpenModal,
	canExport,
	canSave,
	onSave,
	isDirty,
	boundaryName,
}) {
	/* States */
	const [openMenu, setOpenMenu] = useState(null);
	const toolbarRef = useRef(null);

	function handleMenuItemClick(item) {
		switch (item.action) {
			case 'save':
				onSave();
				break;
			case 'modal':
				onOpenModal(item.modal);
				break;
			default:
				console.warn(`Unknown action: ${item.action}`);
		}

		setOpenMenu(null);
	}

	/* Closes dropdown menu when user clicks anywhere on screen */
	useClickOutside(toolbarRef, () => {
		setOpenMenu(null);
	});

	/* Toggles menu */
	function toggleMenu(id) {
		setOpenMenu((current) => (current === id ? null : id));
	}

	const toolbarMenus = menus.map((menu) => ({
		...menu,
		items: menu.items.map((item) => ({
			...item,
			disabled: item.requires === 'canSave' ? !canSave : item.disabled,
		})),
	}));

	return (
		<div className="toolbar">
			<ToolbarBrand />

			<div className="toolbar-content" ref={toolbarRef}>
				<ToolbarButton
					title="Save"
					icon={<Save size={18} />}
					indicator={isDirty}
					disabled={!isDirty}
					onClick={onSave}
				/>
				<ToolbarButton
					title="Export"
					icon={<Download size={18} />}
					disabled={!canExport}
					onClick={() => onOpenModal('export')}
				/>
				{toolbarMenus.map((menu) => (
					<ToolbarDropdown
						key={menu.id}
						title={menu.title}
						icon={<CirclePlus size={18} />}
						items={menu.items}
						isOpen={openMenu === menu.id}
						onToggle={() => toggleMenu(menu.id)}
						onItemClick={handleMenuItemClick}
					/>
				))}
			</div>

			<div className="toolbar-actions">
				<BoundaryIndicator boundaryName={boundaryName} />
				<a
					href="https://github.com/Keepercal/streets-dashboard"
					target="_blank"
					rel="noopener noreferrer"
					className="github-link"
					aria-label="Open GitHub repository"
				>
					<img src="./github-mark.svg" alt="GitHub" />
				</a>
			</div>
		</div>
	);
}
