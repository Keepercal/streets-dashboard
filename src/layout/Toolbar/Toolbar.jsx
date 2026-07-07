import ToolbarBrand from './ToolbarBrand'

export default function Toolbar(){
    return (
        <div className="toolbar">
            <ToolbarBrand/>

            <div className="toolbar-content">
                <nav>
                    <button>Project</button>
                    <button>Export</button>
                </nav>
            </div>
        </div>
    )
}