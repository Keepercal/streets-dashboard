import './FeatureCounter.css';
import countFeatures from '../../utils/countFeatures';

/**
 * FeatureCounter
 * ------------
 * Displays a summary count across all loaded feature layers.
 */
const FeatureCounter = ({ features }) => {
	const { nodeCount, wayCount, relationCount } = countFeatures(features);

	return (
		<div className="feature-count-content">
			<div className="feature-count-item">
				<p>Nodes {nodeCount}</p>

				<p>Ways {wayCount}</p>

				<p>Relations {relationCount}</p>
			</div>
		</div>
	);
};

export default FeatureCounter;
