/**
 * TagItem
 * -------
 * Displays an available filter tag that can be added to active filters.
 *
 * Clicking "+" adds a new filter object for the selected tag.
 */

function TagItem({ tag, setFilters }) {
    const handleAddFilter = () => {
        setFilters(prev => [
            ...prev,
            {
                key: tag,
                operator: "...",
                value: ""
            }
        ]);
    };

    return (
        <div className="filter-item">
            <button onClick={handleAddFilter}>
                +
            </button>

            <span>{tag}</span>
        </div>
    );
}

export default TagItem;