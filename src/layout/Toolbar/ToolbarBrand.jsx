import './Toolbar.css';

const ToolbarBrand = () => (
    <>
        <h2 className="brand-title">{__APP_NAME__}</h2>
        <p className="version-tag">v{__APP_VERSION__}</p>
    </>
)

export default ToolbarBrand;