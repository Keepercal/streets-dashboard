import ToolbarBrand from './ToolbarBrand'

export default function Toolbar(){
    return (
        <div className="toolbar">
            <div className="toolbar-brand">
                <ToolbarBrand/>
            </div>

            <div className="toolbar-content">
                <nav>
                    <button>Project</button>
                    <button>Export</button>
                </nav>
            </div>
        </div>
    )
}