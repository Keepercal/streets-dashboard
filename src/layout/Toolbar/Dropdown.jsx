import './Dropdown.css';

export default function Dropdown({ 
    title, 
    items, 
    isOpen, 
    onToggle
}){
    return(
        <div 
            className="dropdown"
            onClick={onToggle}
        >
            <button
                className={`dropdown-button ${isOpen ? "open" : ""}`}
                onClick={onToggle}
            >
                {title} ▼ 
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    {items.map(item => (
                        <button
                            key={item.id}
                            className="dropdown-item"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}