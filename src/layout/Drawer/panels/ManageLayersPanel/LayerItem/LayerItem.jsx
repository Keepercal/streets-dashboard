import './LayerItem.css';
import { Eye, EyeOff, Trash2, Palette, Check, Pencil } from 'lucide-react';
import { useState } from 'react';
import LayerFilters from './LayerFilters/LayerFilters';

export default function LayerItem({
	layerID,
	layer,
	toggleLayerVisibility,
	updateLayer,

	updateLayerFilters,

	removeLayer,
	renameLayer,
}) {
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState('');
	const [showFilters, setShowFilters] = useState(false);

	const hasFilters = layer.filters?.length > 0;

	const startEditing = (key, currentName) => {
		setEditing(true);
		setName(currentName);
	};

	const saveRename = (layerID) => {
		const trimmedName = name.trim();

		if (trimmedName.length > 0) {
			renameLayer(layerID, trimmedName);
		}

		setEditing(false);
		setName('');
	};

	return (
		<>
			<div className="layer-item">
				<div className="layer-header">
					<div className="layer-name">
						{editing ? (
							<input
								className="layer-name-input"
								value={name}
								autoFocus
								onChange={(event) =>
									setName(event.target.value)
								}
								onKeyDown={(event) => {
									if (event.key === 'Enter') {
										saveRename(layerID);
									}
									if (event.key === 'Escape') {
										setEditing(null);
									}
								}}
							/>
						) : (
							<span className="layer-name">
								{layer.displayName ??
									layer.label ??
									layer.sourceKey}
							</span>
						)}
					</div>

					<div className="layer-actions">
						{/* Rename */}
						{editing ? (
							<button
								className="layer-action-btn  rename-confirm"
								onClick={() => saveRename(layerID)}
								title="Save name"
							>
								<Check size={22} />
							</button>
						) : (
							<button
								className="layer-action-btn rename"
								onClick={() =>
									startEditing(
										layerID,
										layer.displayName ??
											layer.label ??
											layer.sourceKey
									)
								}
								title="Rename layer"
							>
								<Pencil size={22} />
							</button>
						)}

						{/* Visibility */}
						<button
							className={`layer-action-btn ${
								layer.visible ? 'show' : 'hide'
							}`}
							onClick={() => toggleLayerVisibility(layerID)}
							title={layer.visible ? 'Hide Layer' : 'Show Layer'}
						>
							{layer.visible ? (
								<Eye size={22} />
							) : (
								<EyeOff size={22} />
							)}
						</button>

						{/* Colour */}
						<div
							className="colour-swatch"
							style={{
								backgroundColor: layer.colour ?? '#3388ff',
							}}
						>
							<input
								type="color"
								value={layer.colour ?? '#3388ff'}
								onChange={(event) =>
									updateLayer(layerID, {
										colour: event.target.value,
									})
								}
								onBlur={(event) => event.target.blur()}
							/>
						</div>

						{/* Delete */}
						<button
							className="layer-action-btn delete"
							onClick={() => removeLayer(layerID)}
							title="Delete layer"
						>
							<Trash2 size={22} />
						</button>
					</div>
				</div>
				{/* Filter */}
				<div
					className="layer-filter-toggle"
					onClick={() => setShowFilters((prev) => !prev)}
					title="Filter layer"
				>
					{hasFilters
						? `${layer.filters.length} Filter${layer.filters.length > 1 ? 's' : ''} Applied`
						: 'Apply Filters to Layer'}
					<span>{showFilters ? '▲' : '▼'}</span>
				</div>

				{showFilters && (
					<LayerFilters
						layerID={layerID}
						layer={layer}
						updateLayerFilters={updateLayerFilters}
					/>
				)}
			</div>
		</>
	);
}
