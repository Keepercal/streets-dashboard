import { useMemo } from "react";

/**
 * useFilterData
 * -------------
 * Extracts and prepares metadata from GeoJSON features for use in a filter UI.
 *
 * Responsibilities:
 * - Collect all unique property keys (tags) from features
 * - Map each tag to its unique set of values
 * - Derive available (unused) tags based on active filters
 * - Provide a helper for retrieving sorted values per tag
 *
 * This hook memoises results to avoid recomputation unless `features` or `filters` change.
 */
export default function useFilterData(features, filters) {
    return useMemo(() => {
        // Unique set of all property keys across all features
        const tagSet = new Set();

        // Maps each property key → Set of unique values
        const tagValueMap = {};

        // Extract metadata from GeoJSON features
        features?.features?.forEach(feature => {
            const tags = feature?.properties || {};

            Object.entries(tags).forEach(([key, value]) => {
                tagSet.add(key);

                if (!tagValueMap[key]) {
                    tagValueMap[key] = new Set();
                }

                tagValueMap[key].add(value);
            });
        });

        // Determine which tags are already used by active filters
        const activeKeys = new Set(filters.map(f => f.key));

        // Available (unused) tags sorted alphabetically
        const tags = [...tagSet]
            .filter(tag => !activeKeys.has(tag))
            .sort();

        // Helper: return sorted list of values for a given tag
        const getValues = (key) =>
            tagValueMap[key]
                ? [...tagValueMap[key]].sort()
                : [];

        return {
            tagSet,
            tagValueMap,
            tags,
            getValues,
        };
    }, [features, filters]);
}