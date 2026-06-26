/**
 * FilterItem
 * ----------
 * Renders a single active filter row in the FilterPanel.
 *
 * Responsibilities:
 * - Display filter key, operator, and optional value selector
 * - Allow updating or removing a filter
 * - Dynamically show available values for the selected key
 *
 * NOTE:
 * Uses index-based updates because filters are stored as an array.
 * In larger systems, consider using filter IDs instead of indexes.
 */

function FilterItem({ filter, index, setFilters, getValues }) {
    // Remove this filter from the list
    const handleRemove = () => {
        setFilters(prev => prev.filter((_, i) => i !== index));
    };

    // Update a specific field (operator or value)
    const updateFilter = (field, value) => {
        setFilters(prev =>
            prev.map((f, i) =>
                i === index
                    ? { ...f, [field]: value }
                    : f
            )
        );
    };

    const showValueSelect =
        filter.operator !== "..." &&
        filter.operator !== "exists" &&
        filter.operator !== "missing";

    return (
        <div className="filter-item">
            {/* Remove filter */}
            <button onClick={handleRemove}>
                ✕
            </button>

            {/* Filter key */}
            <strong>{filter.key}</strong>

            {/* Operator selector */}
            <select
                value={filter.operator}
                onChange={(e) => updateFilter("operator", e.target.value)}
            >
                <option value="...">...</option>
                <option value="equals">equals</option>
                <option value="not_equals">not equals</option>
                <option value="exists">exists</option>
                <option value="missing">missing</option>
            </select>

            {/* Value selector (conditional) */}
            {showValueSelect && (
                <select
                    value={filter.value}
                    onChange={(e) => updateFilter("value", e.target.value)}
                >
                    <option value="">-- any value --</option>

                    {getValues(filter.key).map(val => (
                        <option key={val} value={val}>
                            {val}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}

export default FilterItem;