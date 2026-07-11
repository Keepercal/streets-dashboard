import './RadioItem.css'

/**
 * Radio item
 */
const RadioItem = ({ label, value, selected, onChange }) => (
    <div className="radio-item">
        <label className="radio-label">
            <input
                className="radio-checkbox"
                type="radio"
                value={value}
                checked={selected === value}
                onChange={() => onChange(value)}
            />
            {label}
        </label>
    </div>
);

export default RadioItem;