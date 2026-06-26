/**
 * Toggle checkbox item
 */
const ToggleItem = ({ label, checked, onChange }) => (
    <div className="toggle-item">
        <label>
            <input
                type="checkbox"
                checked={!!checked}
                onChange={onChange}
            />
            {label}
        </label>
    </div>
);

export default ToggleItem;