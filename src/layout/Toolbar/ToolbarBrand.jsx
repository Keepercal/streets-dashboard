import './Toolbar.css';

const ToolbarBrand = () => (
    <a className="toolbar-brand" href="/">
        <img 
            className="brand-logo" 
            src='./favicon.svg' 
            alt={`${__APP_NAME__} logo`}
        />
        <div className="brand-text">
            <h2 className="brand-title">{__APP_NAME__}</h2>
            <p className="version-tag">v{__APP_VERSION__}</p>
        </div>
    </a>
)

export default ToolbarBrand;