import '../Sidebar.css';

const SidebarHeader = () => (
    <div className="sidebar-header">
        <h1 className="sidebar-title">{__APP_NAME__}</h1>
        <p className="version-tag">v{__APP_VERSION__}</p>
    </div>
)

export default SidebarHeader;