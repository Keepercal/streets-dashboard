/**
 * Dropdown selector (generic)
 */
const DropdownItem = ({ value, options, onChange }) => (
    <div className="dropdown-item">
        <select
            className="dropdown-btn"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {(options || []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

export default DropdownItem;