export function evaluateFeature(feature, filters) {
    const tags = feature.properties || {};

    return filters.every(filter => {
        const value = tags[filter.key];

        switch (filter.operator) {
            case "equals":
                return String(value ?? "") === filter.value;

            case "not_equals":
                return String(value ?? "") !== filter.value

            case "exists":
                return value !== undefined;

            case "missing":
                return value === undefined;

            default:
                return true;
        }
    })
}