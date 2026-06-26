/**
 * Dropdown selector (generic)
 */
const DropdownItem = ({ selectedBoundary, boundaryOptions, onChange }) => {
    return(
        <div className="dropdown-item">
            <select
                className="dropdown-btn"
                value={selectedBoundary}
                onChange={(e) => onChange(e.target.value)}
            >
                {(boundaryOptions || []).map((opt) => (
                    <option key={opt.key} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropdownItem;