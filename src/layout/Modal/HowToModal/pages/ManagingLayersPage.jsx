import { helpImages } from '../helpImages';

export default function ManagingLayersPage() {
	return (
		<>
			<h2>Managing map layers</h2>

			<p>
				Within the Manage Layers drawer, you can rename, hide, change
				the colour of and delete layers. You can also delete all layers
				in one button press.
			</p>

			<img
				src={helpImages.manageLayers}
				alt={`A screenshot of the ${__APP_NAME__} interface with the Manage Layers draw open and a Pubs layer active.`}
			/>

			<p>
				{__APP_NAME__} does more than just display OpenStreetMap data.
				Every feature in OpenStreetMap contains data known as "Tags".
				These give a feature more information, for example whether a pub
				is wheelchair accessible.
			</p>

			<img
				src={helpImages.featureTags}
				alt={`A screenshot of the ${__APP_NAME__} interface with the Manage Layers draw open and a Pubs layer 
				active and the feature overview popup for the Foresters Arms pub, showing its tags and metadata.`}
			/>

			<p>
				You can use the Manage Layers panel to filter the data displayed
				on the map based on tags to your liking. Here is the Pubs layer
				again with a filter applied, showing all pubs that have a
				wheelchair tag equal to yes.
			</p>

			<img
				src={helpImages.wheelchairAccessible}
				alt={`A screenshot of the ${__APP_NAME__} interface showing only the pubs that have a wheelchair tag equal to yes`}
			/>

			<p>
				Or you can show all pubs that are missing the wheelchair tag.
				This is useful for auditing features to find missing tags, and
				adding the information yourself within OpenStreetMap.{' '}
			</p>

			<img
				src={helpImages.wheelchairMissing}
				alt={`A screenshot of the ${__APP_NAME__} interface showing only the pubs that are missing the wheelchair tag`}
			/>
		</>
	);
}
