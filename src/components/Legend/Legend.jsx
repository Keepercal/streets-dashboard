import './Legend.css';

const legendItems = [
	{
		label: '< 1 year',
		color: '#5ba328',
	},
	{
		label: '1–3 years',
		color: '#e7bb2d',
	},
	{
		label: '3+ years',
		color: '#dd351b',
	},
];

/**
 * Legend
 * ------
 * Displays a map legend explaining dot colours based on "last edited" age.
 */
function Legend() {
	return (
		<div className="legend">
			<div className="legend-content">
				<h4>Last Edited</h4>

				{legendItems.map((item) => (
					<div key={item.label} className="legend-item">
						<div
							className="legend-dot"
							style={{
								backgroundColor: item.color,
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
