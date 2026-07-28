import './Legend.css';
import createPinIcon from '../../utils/createPinIcon';

const legendItems = [
	{
		label: '< 1 year',
		icon: createPinIcon('#739D55'),
	},
	{
		label: '1–3 years',
		icon: createPinIcon('#E0C055'),
	},
	{
		label: '3+ years',
		icon: createPinIcon('#D83F29'),
	},
];

/**
 * Legend
 * ------
 * Displays a map legend explaining pin colors based on "last edited" age.
 */
function Legend() {
	return (
		<div className="legend">
			<div className="legend-content">
				<h3>Last Edited</h3>

				{legendItems.map((item) => (
					<div key={item.label} className="legend-item">
						<div
							className="legend-icon"
							dangerouslySetInnerHTML={{
								__html: item.icon.options.html,
							}}
						/>
						<span>{item.label}</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default Legend;
