import './Dropdown.css';

export default function Dropdown({ 
    title, 
    items, 
    isOpen, 
    onToggle,
    onItemClick
}){
    return(
        <div 
            className="dropdown"
        >
            <button
                className={`dropdown-button ${isOpen ? "open" : ""}`}
                onClick={onToggle}
            >
                {title} ⏷ 
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    {items.map(item => (
                        <button
                            key={item.id}
                            className="dropdown-item"
                            disabled={item.disabled}
                            onClick={(e) => {
                                e.stopPropagation();

                                if (item.disabled) return;

                                onItemClick(item);
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}