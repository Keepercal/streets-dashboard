import './SidebarButton.css';

const SidebarButton = ({ label, icon, active, disabled, onClick }) => (
	<button
		className={`sidebar-button 
            ${active ? 'active' : ''}
            ${disabled ? 'disabled' : ''}
        `}
		disabled={disabled}
		onClick={onClick}
	>
		{icon && <span className="sidebar-button-icon">{icon}</span>}

		<span className="sidebar-button-label">{label}</span>
	</button>
);

export default SidebarButton;
