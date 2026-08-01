import { useState, useRef, useCallback } from 'react';
import osmtogeojson from 'osmtogeojson';

import { fetchMapFeature } from '../services/overpass/overpass';

/**
 * useMapFeatures
 * ------------
 * Fetches OSM map features for a selected boundary and filter.
 *
 * Includes:
 * - request deduplication via cache
 * - request cancellation
 * - GeoJSON conversion
 */
export default function useMapFeatures({ onChange = () => {} } = {}) {
	const [featureLayers, setFeatureLayers] = useState({});

	/* Status popup handling */
	const [status, setStatus] = useState('idle');
	const [error, setError] = useState(null);

	/* Cacheing */
	const requestId = useRef(0);
	const cache = useRef(new Map());

	/* Flags */
	const [failedFeatureKey, setFailedFeatureKey] = useState(null); // cleanup

	function markDirty() {
		onChange?.();
	}

	const buildLayer = useCallback(
		({
			sourceKey,
			label,
			data,
			geojson,
			colour,
			visible = true,
			filters = [],
		}) => ({
			sourceKey,
			label,
			data,
			geojson,
			colour,
			visible,
			filters,
		}),
		[]
	);

	function patchLayer(layerID, changes) {
		setFeatureLayers((prev) => ({
			...prev,
			[layerID]: {
				...prev[layerID],
				...changes,
			},
		}));

		markDirty();
	}

	/* Remove all features from map */
	const clearFeatures = ({ markDirty = true } = {}) => {
		console.log('[DEBUG] clearing all map features');

		setFeatureLayers({});

		if (markDirty) {
			onChange?.();
		}

		setError(null);
		setStatus('idle');
	};
	/* Remove a single feature */
	const removeLayer = (layerID) => {
		console.log('[DEBUG] removing feature:', { layerID });
		setFeatureLayers((prev) => {
			const next = { ...prev };

			delete next[layerID];

			return next;
		});

		setError(null);
		setStatus('idle');
		markDirty();
	};

	/* Show or hide features on the map */
	const toggleLayerVisibility = (layerID) => {
		setFeatureLayers((prev) => {
			const layer = prev[layerID];

			if (!layer) return prev;

			return {
				...prev,
				[layerID]: {
					...layer,
					visible: !layer.visible,
				},
			};
		});

		markDirty();
	};

	/* Generate a colour for feature data, colour will be consistent across projects */
	function getLayerColour(key) {
		key = String(key ?? '');

		let hash = 0;

		for (let i = 0; i < key.length; i++) {
			hash = key.charCodeAt(i) + ((hash << 5) - hash);
		}

		const colour = (hash & 0x00ffffff).toString(16).padStart(6, '0');

		return `#${colour}`;
	}

	/* Create label for each layer with an indicator for if it's a duplicate */
	const generateLayerLabel = (layers, featureKey, featureLabel) => {
		let count = 0;

		for (const id in layers) {
			if (layers[id].sourceKey === featureKey) {
				count++;
			}
		}

		return count === 0 ? featureLabel : `${featureLabel} (${count + 1})`;
	};

	/* Update layer filter */
	const updateLayerFilters = (layerID, filters) => {
		patchLayer(layerID, { filters });
	};

	function cacheLayer(cacheKey, layer) {
		cache.current.set(cacheKey, layer);
	}

	/* Array indicating what features are in the cache */
	// Used in the UI to indicate cached features
	const getCachedFeatures = (boundaryKey) => {
		return Array.from(cache.current.entries())
			.filter(([cacheKey]) => {
				const [cachedBoundary] = JSON.parse(cacheKey);

				return cachedBoundary === boundaryKey;
			})
			.map(([_, layer]) => layer.sourceKey);
	};

	function loadCachedLayer(cacheKey, layerID, featureLabel) {
		// Check cache for stored features
		const cached = cache.current.get(cacheKey);

		if (!cached) return false;

		// Load features from cache
		setFeatureLayers((prev) => {
			const label = generateLayerLabel(
				prev,
				cached.sourceKey,
				featureLabel
			);

			return {
				...prev,
				[layerID]: buildLayer({
					...cached,
					label,
					filters: [],
				}),
			};
		});

		setStatus('success');
	}

	/* Clear cache */
	// Used when loading a new boundary, data isn't left over in the cache
	const clearCache = () => {
		cache.current.clear();
	};

	/* Loads features by calling Overpass API */
	const loadFeatures = async ({
		featureKey,
		boundaryKey,
		featureTag,
		featureValue,
		featureType,
		featureLabel,
	}) => {
		console.log('[DEBUG] handleAddLayer ENTER:', {
			featureKey,
			featureTag,
			featureValue,
			featureType,
			featureLabel,
		});

		if (!featureKey || !boundaryKey || !featureTag) {
			throw new Error('Missing required feature parameters');
		}

		const layerID = crypto.randomUUID(); // Generate unique ID for layer

		console.log({
			featureKey,
			type: typeof featureKey,
			boundaryKey,
			featureTag,
		});

		const colour = getLayerColour(featureKey);

		const currentId = ++requestId.current;

		if (featureValue === null) {
			setStatus('idle');
			return;
		}

		const cacheKey = JSON.stringify([
			// Store results in cache
			boundaryKey,
			featureTag,
			featureValue,
			featureType,
			featureLabel,
		]);

		if (cache.current.has(cacheKey)) {
			loadCachedLayer(cacheKey, layerID, featureLabel);
			return;
		}

		setFeatureLayers((prev) => {
			const next = { ...prev };
			delete next[featureKey];
			return next;
		});

		setError(null);
		setFailedFeatureKey(null);
		setStatus('loading');

		try {
			// Fetch map feature from Overpass API
			const result = await fetchMapFeature(
				boundaryKey,
				featureTag,
				featureValue,
				featureType,
				featureLabel
			);

			if (currentId !== requestId.current) return;

			const geojson = osmtogeojson(result, {
				meta: true,
			}); // Convert to geoJSON

			cacheLayer(cacheKey, {
				sourceKey: featureKey,
				data: result,
				geojson,
				colour,
				query: {
					boundaryKey,
					featureTag,
					featureValue,
					featureType,
					featureLabel,
				},
			});

			setFeatureLayers((prev) => {
				const label = generateLayerLabel(
					prev,
					featureKey,
					featureLabel
				);

				return {
					// Create a new object for the feature
					...prev,
					[layerID]: buildLayer({
						sourceKey: featureKey,
						label,
						data: result,
						geojson,
						colour,
					}),
				};
			});

			setStatus('success');
			markDirty();
		} catch (err) {
			if (currentId !== requestId.current) return;

			setFailedFeatureKey(featureKey); // pass back the feature that failed to load

			setError(err);
			setStatus('error');
		}
	};

	/* Layer inspection and updating */
	const updateLayer = (layerID, changes) => {
		patchLayer(layerID, changes);
	};

	const exportLayers = () => {
		return Object.entries(featureLayers).map(([id, layer]) => ({
			id,
			...layer,
		}));
	};

	const restoreLayers = (layers) => {
		if (!layers) {
			setFeatureLayers({});
			return;
		}

		const restored = {};

		layers.forEach((layer) => {
			restored[layer.id] = buildLayer({
				...layer,
				filters: layer.filters ?? [],
			});
		});

		setFeatureLayers(restored);

		setStatus('success');
		setError(null);
		markDirty();
	};

	return {
		// state
		featureLayers,

		// data operations
		loadFeatures,
		clearFeatures,
		removeLayer,

		// layer editing
		toggleLayerVisibility,
		updateLayer,
		updateLayerFilters,

		// persistence
		exportLayers,
		restoreLayers,

		// cache
		getCachedFeatures,
		clearCache,

		// status
		failedFeatureKey,
		status,
		error,
	};
}
